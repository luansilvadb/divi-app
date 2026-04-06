import { defineStore } from 'pinia'
import { ref, shallowRef, computed, watch } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { ICategoryRepository } from '@/shared/domain/contracts/ICategoryRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import type { Category } from '@/shared/domain/entities/Category'

type UITransaction = Transaction & { _titleLower: string; _timestamp: number; _dateKey: string }

export const useTransactionStore = defineStore('transactions', () => {
  // Repositories
  const transactionRepo = container.resolve<ITransactionRepository>(DI_TOKENS.TransactionRepository)
  const walletRepo = container.resolve<IWalletRepository>(DI_TOKENS.WalletRepository)
  const categoryRepo = container.resolve<ICategoryRepository>(DI_TOKENS.CategoryRepository)

  // State
  const transactions = shallowRef<Transaction[]>([])
  const wallets = shallowRef<Wallet[]>([])
  const categories = shallowRef<Category[]>([])
  const isLoading = ref(false)

  // UI State
  const searchQuery = ref('')

  // Maps for O(1) Lookups
  const categoryMap = shallowRef<Record<string, Category>>({})
  const walletMap = shallowRef<Record<string, Wallet>>({})

  const totalIncome = ref(0)
  const totalExpense = ref(0)
  const monthlyBalance = computed(() => totalIncome.value - totalExpense.value)

  // Top Categories Single Pass
  const topCategories = computed(() => {
    const catMap: Record<string, number> = {}
    const trans = transactions.value

    for (let i = 0, len = trans.length; i < len; i++) {
      const t = trans[i]!
      if (t.type === 'expense') {
        catMap[t.category_id] = (catMap[t.category_id] || 0) + t.amount
      }
    }

    const expenseTotal = totalExpense.value
    if (expenseTotal === 0) return []

    return Object.entries(catMap)
      .map(([id, total]) => {
        const cat = categoryMap.value[id]
        return {
          id,
          name: cat?.name || 'Outros',
          color: cat?.color || '#9ca3af',
          total,
          percent: (total / expenseTotal) * 100,
        }
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  })

  // Sort happens on fetch/update now, preventing O(N log N) on every UI computation.
  watch(
    transactions,
    (newTransactions: Transaction[]) => {
      let inc = 0
      let exp = 0
      for (let i = 0, len = newTransactions.length; i < len; i++) {
        const t = newTransactions[i]!
        if (t.type === 'income') inc += t.amount
        else if (t.type === 'expense') exp += t.amount
      }
      totalIncome.value = inc
      totalExpense.value = exp
    },
    { immediate: true },
  )

  // UI Getters
  const uiTransactions = computed(() => {
    return transactions.value as UITransaction[]
  })

  const filteredTransactionsArray = computed(() => {
    if (!searchQuery.value.trim()) return uiTransactions.value

    const query = searchQuery.value.toLowerCase().trim()
    const result: UITransaction[] = []
    const trans = uiTransactions.value
    const catMap = categoryMap.value

    for (let i = 0, len = trans.length; i < len; i++) {
      const t = trans[i]!
      if (t._titleLower.includes(query)) {
        result.push(t)
        continue
      }

      const cat = catMap[t.category_id]
      if (cat && cat.name.toLowerCase().includes(query)) {
        result.push(t)
      }
    }

    return result
  })

  const groupedTransactions = computed(() => {
    const groups: Record<string, { total: number; items: UITransaction[] }> = {}
    const source = filteredTransactionsArray.value

    for (let i = 0, len = source.length; i < len; i++) {
      const t = source[i]!
      const dateKey = t._dateKey
      if (dateKey) {
        let group = groups[dateKey]
        if (!group) {
          group = { total: 0, items: [] }
          groups[dateKey] = group
        }
        group.items.push(t)
        group.total += t.type === 'income' ? t.amount : -t.amount
      }
    }

    return groups
  })

  // Actions
  async function fetchWallets() {
    const w = await walletRepo.getAll()
    wallets.value = w
    const map: Record<string, Wallet> = {}
    for (let i = 0, len = w.length; i < len; i++) {
      const item = w[i]!
      map[item.id] = item
    }
    walletMap.value = map
  }

  async function fetchCategories() {
    const c = await categoryRepo.getAll()
    categories.value = c
    const map: Record<string, Category> = {}
    for (let i = 0, len = c.length; i < len; i++) {
      const item = c[i]!
      map[item.id] = item
    }
    categoryMap.value = map
  }

  async function fetchTransactionsByMonth(year: number, month: number) {
    isLoading.value = true
    try {
      const raw = await transactionRepo.getByMonth(year, month)
      // Sort by timestamp descending once, preventing sorted re-computations in groupedTransactions
      raw.sort((a, b) => {
        const timeA = (a as UITransaction)._timestamp
        const timeB = (b as UITransaction)._timestamp
        return timeB - timeA
      })
      // Ensure reactivity by assigning a new reference
      transactions.value = [...raw]
    } finally {
      isLoading.value = false
    }
  }

  async function saveTransaction(transaction: Transaction) {
    await transactionRepo.save(transaction)
    const date = new Date(transaction.date)
    await fetchTransactionsByMonth(date.getFullYear(), date.getMonth() + 1)
  }

  async function deleteTransaction(id: string) {
    await transactionRepo.delete(id)
    transactions.value = transactions.value.filter((t) => t.id !== id)
  }

  return {
    transactions,
    wallets,
    categories,
    isLoading,
    searchQuery,
    categoryMap,
    walletMap,
    totalIncome,
    totalExpense,
    monthlyBalance,
    topCategories,
    groupedTransactions,
    fetchWallets,
    fetchCategories,
    fetchTransactionsByMonth,
    saveTransaction,
    deleteTransaction,
  }
})
