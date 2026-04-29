import { v7 as uuidv7 } from 'uuid'
import { defineStore } from 'pinia'
import { ref, shallowRef, computed, watch, type Ref } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import { useSyncStore } from '@/core/sync/syncStore'
import { useAuthStore } from '@/modules/auth/application/authStore'
import type { ITransactionRepository } from '@/modules/transactions/core/ports/ITransactionRepository'
import type { IActivityLogService } from '@/modules/activity-log/core/ports/IActivityLogService'

import { BigIntAdapter } from '@/shared/utils/bigint-adapter'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'
import { useWalletStore } from './useWalletStore'
import { useCategoryStore } from './useCategoryStore'
import { useTransactionStats } from './useTransactionStats'
import { useTransactionSearch } from './useTransactionSearch'
import { useITransactionGrouping } from './useITransactionGrouping'
import { messages, formatMessage } from '@/shared/messages/catalog'

export const useTransactionStore = defineStore('transactions', () => {
  // Services
  const ITransactionRepo = container.resolve<ITransactionRepository>(DI_TOKENS.ITransactionRepository)
  const activityLogService = container.resolve<IActivityLogService>(DI_TOKENS.IActivityLogService)
  const syncStore = useSyncStore()
  const authStore = useAuthStore()

  // Composed stores
  const walletStore = useWalletStore()
  const categoryStore = useCategoryStore()

  const transactions = shallowRef<any[]>([])
  const isLoading = ref(false)

  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth() + 1)

  /**
   * Transforms a domain entity into a UI-optimized object with pre-computed fields for search and grouping.
   */
  function mapToUITransaction(transaction: ITransaction) {
    return {
      ...transaction,
      _titleLower: (transaction.title || '').toLowerCase(),
      _timestamp: new Date(transaction.date).getTime(),
      _dateKey: (transaction.date || '').substring(0, 10),
    }
  }

  async function fetchtransactionsByMonth(year: number, month: number) {
    isLoading.value = true
    currentYear.value = year
    currentMonth.value = month

    try {
      const raw = await ITransactionRepo.getByMonth(year, month)
      const uiTransactions = raw.map(mapToUITransaction)
      uiTransactions.sort((a, b) => b._timestamp - a._timestamp)
      transactions.value = [...uiTransactions]
    } finally {
      isLoading.value = false
    }
  }

  // Auto-refresh when sync changes
  watch(
    () => syncStore.updateCounter,
    () => {
      console.log('[transactionStore] Re-fetching data due to sync update...')
      fetchtransactionsByMonth(currentYear.value, currentMonth.value)
    },
  )

  const activetransactions = computed(() => {
    return transactions.value.filter((tx) => !tx.deleted)
  })

  // Search functionality (SRP)
  const { searchQuery, filteredtransactions: filteredtransactionsArray } = useTransactionSearch(
    activetransactions,
    computed(() => categoryStore.categoryMap),
  )

  // Grouping functionality (SRP)
  const { groupedtransactions } = useITransactionGrouping(filteredtransactionsArray)

  function enrichITransaction(transaction: ITransaction, activeUserId: string): ITransaction {
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

  async function updateLocalState(enriched: ITransaction, isNew: boolean) {
    const uiTx = mapToUITransaction(enriched)
    const index = transactions.value.findIndex((t) => t.id === enriched.id)
    const newArray = [...transactions.value]
    
    if (!isNew && index !== -1) {
      newArray[index] = uiTx
    } else {
      newArray.unshift(uiTx)
    }
    transactions.value = newArray
  }

  async function logITransactionActivity(enriched: ITransaction, activeUserId: string, isNew: boolean) {
    const displayAmt = BigIntAdapter.fromMinorUnits(enriched.amount)
    await activityLogService.logActivity({
      action: isNew ? messages.MSG_ACT_TX_CREATED : messages.MSG_ACT_TX_UPDATED,
      description: formatMessage('MSG_ACT_TX_DESC', { amount: String(displayAmt), title: enriched.title }),
      type: 'success',
      user_id: activeUserId,
    })
  }

  async function saveITransaction(transaction: ITransaction) {
    if (transaction.amount < 0n) {
      throw new Error('Amount must be positive')
    }

    const activeUserId = authStore.user?.id
    if (!activeUserId) throw new Error('User not authenticated')

    const enriched = enrichITransaction(transaction, activeUserId)
    const isUpdate = transactions.value.some((t) => t.id === enriched.id)

    try {
      if (isUpdate) {
        await ITransactionRepo.update(enriched.id, enriched)
      } else {
        await ITransactionRepo.create(enriched)
      }
      
      await updateLocalState(enriched, !isUpdate)
      await logITransactionActivity(enriched, activeUserId, !isUpdate)

      const date = new Date(enriched.date)
      await fetchtransactionsByMonth(date.getFullYear(), date.getMonth() + 1)
    } catch (err) {
      console.error('[transactionStore] Failed to save transaction:', err)
      await fetchtransactionsByMonth(currentYear.value, currentMonth.value)
      throw err
    }
  }

  async function deleteITransaction(id: string) {
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
      await ITransactionRepo.delete(id)

      if (authStore.user?.id) {
        await activityLogService.logActivity({
          action: messages.MSG_ACT_TX_DELETED,
          description: formatMessage('MSG_ACT_TX_DEL_DESC', { title: deletedTitle }),
          type: 'warning',
          user_id: authStore.user.id,
        })
      }
    } catch (err) {
      console.error('[transactionStore] Failed to delete transaction:', err)
      await fetchtransactionsByMonth(currentYear.value, currentMonth.value)
      throw err
    }
  }

  // Stats via composition
  const categoryMapRef = computed(() => categoryStore.categoryMap)
  const stats = useTransactionStats(transactions as unknown as Ref<ITransaction[]>, () => categoryMapRef as unknown as Ref<Record<string, ICategory>>)

  return {
    transactions,
    wallets: computed(() => walletStore.wallets),
    categories: computed(() => categoryStore.categories),
    isLoading,
    searchQuery,
    categoryMap: computed(() => categoryStore.categoryMap),
    IWalletMap: computed(() => walletStore.IWalletMap),
    totalIncome: computed(() => stats.totalIncome.value),
    totalExpense: computed(() => stats.totalExpense.value),
    monthlyBalance: computed(() => stats.monthlyBalance.value),
    activetransactions: computed(() => stats.activetransactions.value),
    topCategories: computed(() => stats.topCategories.value),
    groupedtransactions,
    fetchwallets: () => walletStore.fetchwallets(),
    fetchCategories: () => categoryStore.fetchCategories(),
    fetchtransactionsByMonth,
    saveITransaction,
    deleteITransaction,
    saveIWallet: (data: any) => walletStore.saveIWallet(data),
    saveCategory: (data: any) => categoryStore.saveCategory(data),
  }
})
