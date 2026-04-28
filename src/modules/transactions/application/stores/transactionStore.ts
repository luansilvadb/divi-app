import { v7 as uuidv7 } from 'uuid'
import { defineStore } from 'pinia'
import { ref, shallowRef, computed, watch, type Ref } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import { useSyncStore } from '@/core/sync/syncStore'
import { useAuthStore } from '@/modules/auth/application/authStore'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { IActivityLogService } from '@/modules/activity-log/domain/contracts/IActivityLogService'
import { TransactionService } from '../services/TransactionService'
import { BigIntAdapter } from '@/shared/utils/bigint-adapter'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import { useWalletStore } from './useWalletStore'
import { WalletService } from '@/modules/wallets/application/services/WalletService'
import { useCategoryStore } from './useCategoryStore'
import { useTransactionStats } from './useTransactionStats'
import { useTransactionSearch } from './useTransactionSearch'
import { useTransactionGrouping } from './useTransactionGrouping'

type UITransaction = Transaction & { _titleLower: string; _timestamp: number; _dateKey: string }

export const useTransactionStore = defineStore('transactions', () => {
  // Services
  const transactionService = container.resolve<TransactionService>(DI_TOKENS.TransactionService)
  const transactionRepo = container.resolve<ITransactionRepository>(DI_TOKENS.TransactionRepository)
  const activityLogService = container.resolve<IActivityLogService>(DI_TOKENS.ActivityLogService)
  const syncStore = useSyncStore()
  const authStore = useAuthStore()

  // Composed stores for backward compatibility
  const walletStore = useWalletStore()
  const categoryStore = useCategoryStore()

  const transactions = shallowRef<Transaction[]>([])
  const isLoading = ref(false)

  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth() + 1)

  async function fetchTransactionsByMonth(year: number, month: number) {
    isLoading.value = true
    currentYear.value = year
    currentMonth.value = month

    try {
      const raw = await transactionRepo.getByMonth(year, month)
      raw.sort((a, b) => {
        const timeA = (a as UITransaction)._timestamp
        const timeB = (b as UITransaction)._timestamp
        return timeB - timeA
      })
      transactions.value = [...raw]
    } finally {
      isLoading.value = false
    }
  }

  // Auto-refresh when sync changes
  watch(
    () => syncStore.updateCounter,
    () => {
      console.log('[TransactionStore] Re-buscando dados devido a mudança no Sync...')
      fetchTransactionsByMonth(currentYear.value, currentMonth.value)
    },
  )

  // Transaction filtering - delegated to composable for SRP
  const activeTransactions = computed(() => {
    return (transactions.value as UITransaction[]).filter((transaction) => !transaction.deleted)
  })

  // Search functionality - extracted to useTransactionSearch composable (SRP)
  const { searchQuery, filteredTransactions: filteredTransactionsArray } = useTransactionSearch(
    activeTransactions,
    computed(() => categoryStore.categoryMap),
  )

  // Grouping functionality - extracted to useTransactionGrouping composable (SRP)
  const { groupedTransactions } = useTransactionGrouping(filteredTransactionsArray)

  function enrichTransaction(transaction: Transaction, activeUserId: string): Transaction {
    return {
      ...transaction,
      id: transaction.id || uuidv7(),
      user_id: transaction.user_id || activeUserId,
      date: transaction.date || new Date().toISOString().slice(0, 10),
      sync_status: 'pending',
      deleted: false,
      client_updated_at: new Date().toISOString(),
      version: transaction.version || 1,
    }
  }

  async function updateLocalState(enriched: Transaction, isNew: boolean) {
    const index = transactions.value.findIndex((t) => t.id === enriched.id)
    const newArray = [...transactions.value]
    if (!isNew) {
      newArray[index] = enriched
    } else {
      newArray.unshift(enriched)
    }
    transactions.value = newArray
  }

  async function logTransactionActivity(enriched: Transaction, activeUserId: string, isNew: boolean) {
    const displayAmt = BigIntAdapter.fromMinorUnits(enriched.amount)
    await activityLogService.logActivity({
      action: isNew ? 'Nova Transação' : 'Transação Atualizada',
      description: `R$ ${displayAmt} : ${enriched.title}`,
      type: 'success',
      user_id: activeUserId,
    })
  }

  async function saveTransaction(transaction: Transaction) {
    if (transaction.amount < 0n) {
      throw new Error('Amount must be positive')
    }

    const activeUserId = authStore.user?.id
    if (!activeUserId) throw new Error('User not authenticated')

    const enriched = enrichTransaction(transaction, activeUserId)
    const isNew = !transactions.value.some((t) => t.id === enriched.id)

    await updateLocalState(enriched, isNew)

    try {
      await transactionRepo.save(enriched)
      await logTransactionActivity(enriched, activeUserId, isNew)

      const date = new Date(enriched.date)
      await fetchTransactionsByMonth(date.getFullYear(), date.getMonth() + 1)
    } catch (err) {
      const errorContext = {
        operation: 'saveTransaction',
        transactionId: enriched.id,
        transactionTitle: enriched.title,
        userId: activeUserId,
        isNew,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[TransactionStore] Failed to save transaction:', errorContext, err)
      await fetchTransactionsByMonth(currentYear.value, currentMonth.value)
      throw err
    }
  }

  async function deleteTransaction(id: string) {
    const index = transactions.value.findIndex((t) => t.id === id)
    let deletedTitle = 'Desconhecida'
    if (index !== -1) {
      const target = transactions.value[index]!
      deletedTitle = target.title
      const newArray = [...transactions.value]
      newArray[index] = {
        ...target,
        deleted: true,
        sync_status: 'pending',
        client_updated_at: new Date().toISOString(),
      }
      transactions.value = newArray
    }

    try {
      await transactionRepo.delete(id)

      if (authStore.user?.id) {
        await activityLogService.logActivity({
          action: 'Transação Removida',
          description: `Remoção da transação: ${deletedTitle}`,
          type: 'warning',
          user_id: authStore.user.id,
        })
      }
    } catch (err) {
      const errorContext = {
        operation: 'deleteTransaction',
        transactionId: id,
        transactionTitle: deletedTitle,
        userId: authStore.user?.id,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[TransactionStore] Failed to delete transaction:', errorContext, err)
      await fetchTransactionsByMonth(currentYear.value, currentMonth.value)
      throw err
    }
  }

  // Wallet operations - delegated to walletService for backward compatibility
  async function saveWallet(walletData: Partial<Wallet> & { name: string; balanceNum?: number; currency?: string }) {
    const walletService = container.resolve<WalletService>(DI_TOKENS.WalletService)
    const isUpdate = !!walletData.id

    if (isUpdate && walletData.id) {
      // Update existing wallet
      const existing = walletStore.walletMap[walletData.id]
      if (!existing) throw new Error('Wallet not found')

      const updated: Wallet = {
        ...existing,
        ...walletData,
        balance: walletData.balanceNum !== undefined
          ? BigInt(Math.round(walletData.balanceNum * 100))
          : existing.balance,
        currency: walletData.currency || existing.currency,
        client_updated_at: new Date().toISOString(),
        version: (existing.version || 0) + 1,
      }
      await walletService['walletRepo'].save(updated)
      await walletStore.fetchWallets()
    } else {
      // Create new wallet
      await walletService.createWallet({
        name: walletData.name,
        type: walletData.type || 'checking',
        currency: walletData.currency || 'BRL',
        icon: walletData.icon || 'wallet',
        balance: walletData.balanceNum || 0,
      })
    }
  }

  // Stats via composition - pass the shallowRefs directly
  const categoryMapRef = computed(() => categoryStore.categoryMap)
  const stats = useTransactionStats(transactions as unknown as Ref<Transaction[]>, () => categoryMapRef as unknown as Ref<Record<string, Category>>)

  return {
    transactions,
    wallets: computed(() => walletStore.wallets),
    categories: computed(() => categoryStore.categories),
    isLoading,
    searchQuery,
    categoryMap: computed(() => categoryStore.categoryMap),
    walletMap: computed(() => walletStore.walletMap),
    totalIncome: computed(() => stats.totalIncome.value),
    totalExpense: computed(() => stats.totalExpense.value),
    monthlyBalance: computed(() => stats.monthlyBalance.value),
    activeTransactions: computed(() => stats.activeTransactions.value),
    topCategories: computed(() => stats.topCategories.value),
    groupedTransactions,
    fetchWallets: () => walletStore.fetchWallets(),
    fetchCategories: () => categoryStore.fetchCategories(),
    fetchTransactionsByMonth,
    saveTransaction,
    deleteTransaction,
    saveWallet,
  }
})
