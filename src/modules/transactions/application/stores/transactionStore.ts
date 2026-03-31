import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { ICategoryRepository } from '@/shared/domain/contracts/ICategoryRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import type { Category } from '@/shared/domain/entities/Category'

type UITransaction = Transaction & { _titleLower?: string; _timestamp?: number; _dateKey?: string }

export const useTransactionStore = defineStore('transactions', () => {
  // Repositories
  const transactionRepo = container.resolve<ITransactionRepository>(DI_TOKENS.TransactionRepository)
  const walletRepo = container.resolve<IWalletRepository>(DI_TOKENS.WalletRepository)
  const categoryRepo = container.resolve<ICategoryRepository>(DI_TOKENS.CategoryRepository)

  // State
  const transactions = ref<Transaction[]>([])
  const wallets = ref<Wallet[]>([])
  const categories = ref<Category[]>([])
  const isLoading = ref(false)

  // UI State
  const searchQuery = ref('')

  // Maps for O(1) Lookups
  const categoryMap = ref<Record<string, Category>>({})
  const walletMap = ref<Record<string, Wallet>>({})

  const totalIncome = ref(0)
  const totalExpense = ref(0)
  const monthlyBalance = computed(() => totalIncome.value - totalExpense.value)

  // Top Categories Single Pass
  const topCategories = computed(() => {
    const catMap: Record<string, number> = {}

    for (const t of transactions.value) {
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

  watch(transactions, (newTransactions: Transaction[]) => {
    let inc = 0
    let exp = 0
    for (let i = 0, len = newTransactions.length; i < len; i++) {
      const t = newTransactions[i]!
      if (t.type === 'income') inc += t.amount
      else if (t.type === 'expense') exp += t.amount
    }
    totalIncome.value = inc
    totalExpense.value = exp
  }, { immediate: true })

  // UI Getters
  const uiTransactions = computed(() => {
    return transactions.value as UITransaction[]
  })

  const filteredTransactionsArray = computed(() => {
    if (!searchQuery.value.trim()) return uiTransactions.value

    const query = searchQuery.value.toLowerCase().trim()
    return uiTransactions.value.filter((t) => {
      if ((t._titleLower || t.title.toLowerCase()).includes(query)) return true

      const cat = categoryMap.value[t.category_id]
      if (cat && cat.name.toLowerCase().includes(query)) return true

      return false
    })
  })

  const groupedTransactions = computed(() => {
    const groups: Record<string, { total: number; items: UITransaction[] }> = {}

    const sorted = [...filteredTransactionsArray.value].sort((a, b) => {
      const timeA = a._timestamp || new Date(a.date).getTime()
      const timeB = b._timestamp || new Date(b.date).getTime()
      return timeB - timeA
    })

    for (let i = 0, len = sorted.length; i < len; i++) {
      const t = sorted[i]!
      const dateKey = t._dateKey || t.date.substring(0, 10)
      if (dateKey) {
        if (!groups[dateKey]) {
          groups[dateKey] = { total: 0, items: [] }
        }
        groups[dateKey].items.push(t)
        groups[dateKey].total += (t.type === 'income' ? t.amount : -t.amount)
      }
    }

    return groups
  })

  // Actions
  async function fetchWallets() {
    wallets.value = await walletRepo.getAll()
    const map: Record<string, Wallet> = {}
    for (let i = 0, len = wallets.value.length; i < len; i++) {
      const w = wallets.value[i]!
      map[w.id] = w
    }
    walletMap.value = map
  }

  async function fetchCategories() {
    categories.value = await categoryRepo.getAll()
    const map: Record<string, Category> = {}
    for (let i = 0, len = categories.value.length; i < len; i++) {
      const c = categories.value[i]!
      map[c.id] = c
    }
    categoryMap.value = map
  }

  async function fetchTransactionsByMonth(year: number, month: number) {
    isLoading.value = true
    try {
      transactions.value = await transactionRepo.getByMonth(year, month)
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
