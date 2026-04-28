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
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'
import { usewalletstore } from './usewalletstore'
import { WalletService } from '@/modules/wallets/application/services/WalletService'
import { useCategoryStore } from './useCategoryStore'
import { usetransactionstats } from './usetransactionstats'
import { usetransactionsearch } from './usetransactionsearch'
import { useITransactionGrouping } from './useITransactionGrouping'
import { messages, formatMessage } from '@/shared/messages/catalog'

type UITransaction = any

export const usetransactionstore = defineStore('transactions', () => {
  // Services
  const ITransactionRepo = container.resolve<ITransactionRepository>(DI_TOKENS.ITransactionRepository)
  const activityLogService = container.resolve<IActivityLogService>(DI_TOKENS.IActivityLogService)
  const syncStore = useSyncStore()
  const authStore = useAuthStore()

  // Composed stores for backward compatibility
  const walletstore = usewalletstore()
  const categoryStore = useCategoryStore()

  const transactions = shallowRef<any[]>([])
  const isLoading = ref(false)

  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth() + 1)

  async function fetchtransactionsByMonth(year: number, month: number) {
    isLoading.value = true
    currentYear.value = year
    currentMonth.value = month

    try {
      const raw = await ITransactionRepo.getByMonth(year, month)
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
      console.log('[transactionstore] Re-buscando dados devido a mudança no Sync...')
      fetchtransactionsByMonth(currentYear.value, currentMonth.value)
    },
  )

  // ITransaction filtering - delegated to composable for SRP
  const activetransactions = computed(() => {
    return (transactions.value as UITransaction[]).filter((ITransaction) => !ITransaction.deleted)
  })

  // Search functionality - extracted to usetransactionsearch composable (SRP)
  const { searchQuery, filteredtransactions: filteredtransactionsArray } = usetransactionsearch(
    activetransactions,
    computed(() => categoryStore.categoryMap),
  )

  // Grouping functionality - extracted to useITransactionGrouping composable (SRP)
  const { groupedtransactions } = useITransactionGrouping(filteredtransactionsArray)

  function enrichITransaction(ITransaction: ITransaction, activeUserId: string): ITransaction {
    return {
      ...ITransaction,
      id: ITransaction.id || uuidv7(),
      user_id: ITransaction.user_id || activeUserId,
      date: ITransaction.date || new Date().toISOString().slice(0, 10),
      sync_status: 'pending',
      deleted: false,
      client_updated_at: new Date().toISOString(),
      version: ITransaction.version || 1,
    }
  }

  async function updateLocalState(enriched: ITransaction, isNew: boolean) {
    const uiTx = {
      ...(enriched as any),
      _titleLower: (enriched.title || '').toLowerCase(),
      _timestamp: new Date(enriched.date).getTime(),
      _dateKey: (enriched.date || '').substring(0, 10),
    }

    const index = transactions.value.findIndex((t) => t.id === enriched.id)
    const newArray: any[] = [...transactions.value]
    if (!isNew && index !== -1) {
      newArray[index] = uiTx
    } else {
      newArray.unshift(uiTx)
    }
    transactions.value = newArray as any
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

  async function saveITransaction(ITransaction: ITransaction) {
    if (ITransaction.amount < 0n) {
      throw new Error('Amount must be positive')
    }

    const activeUserId = authStore.user?.id
    if (!activeUserId) throw new Error('User not authenticated')

    const enriched = enrichITransaction(ITransaction, activeUserId)
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
      const errorContext = {
        operation: 'saveITransaction',
        ITransactionId: enriched.id,
        ITransactionTitle: enriched.title,
        userId: activeUserId,
        isNew: !isUpdate,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[transactionstore] Failed to save ITransaction:', errorContext, err)
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
      const errorContext = {
        operation: 'deleteITransaction',
        ITransactionId: id,
        ITransactionTitle: deletedTitle,
        userId: authStore.user?.id,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[transactionstore] Failed to delete ITransaction:', errorContext, err)
      await fetchtransactionsByMonth(currentYear.value, currentMonth.value)
      throw err
    }
  }

  // IWallet operations - delegated to walletservice for backward compatibility
  async function saveIWallet(IWalletData: Partial<IWallet> & { name: string; balanceNum?: number; currency?: string }) {
    const walletService = container.resolve<WalletService>(DI_TOKENS.IWalletService)
    const isUpdate = !!IWalletData.id

    if (isUpdate && IWalletData.id) {
      // Update existing IWallet
      const existing = walletstore.IWalletMap[IWalletData.id]
      if (!existing) throw new Error('IWallet not found')

      await walletService.updateIWallet(IWalletData.id, {
        ...IWalletData,
        balance: IWalletData.balanceNum !== undefined
          ? BigInt(Math.round(IWalletData.balanceNum * 100))
          : existing.balance,
        currency: IWalletData.currency || existing.currency,
      })
      await walletstore.fetchwallets()
    } else {
      // Create new IWallet
      await walletService.createIWallet({
        name: IWalletData.name,
        type: IWalletData.type || 'checking',
        currency: IWalletData.currency || 'BRL',
        icon: IWalletData.icon || 'IWallet',
        balance: IWalletData.balanceNum || 0,
      })
    }
  }

  // Stats via composition - pass the shallowRefs directly
  const categoryMapRef = computed(() => categoryStore.categoryMap)
  const stats = usetransactionstats(transactions as unknown as Ref<ITransaction[]>, () => categoryMapRef as unknown as Ref<Record<string, ICategory>>)

  return {
    transactions,
    wallets: computed(() => walletstore.wallets),
    categories: computed(() => categoryStore.categories),
    isLoading,
    searchQuery,
    categoryMap: computed(() => categoryStore.categoryMap),
    IWalletMap: computed(() => walletstore.IWalletMap),
    totalIncome: computed(() => stats.totalIncome.value),
    totalExpense: computed(() => stats.totalExpense.value),
    monthlyBalance: computed(() => stats.monthlyBalance.value),
    activetransactions: computed(() => stats.activetransactions.value),
    topCategories: computed(() => stats.topCategories.value),
    groupedtransactions,
    fetchwallets: () => walletstore.fetchwallets(),
    fetchCategories: () => categoryStore.fetchCategories(),
    fetchtransactionsByMonth,
    saveITransaction,
    deleteITransaction,
    saveIWallet,
    saveCategory: (categoryData: ICategory) => categoryStore.saveCategory(categoryData),
  }
})
