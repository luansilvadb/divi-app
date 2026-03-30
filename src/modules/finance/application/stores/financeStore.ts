import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '../../../../core/di'
import type {
  ITransactionRepository,
  IWalletRepository,
  ICategoryRepository,
  ILoanRepository,
  ISubscriptionRepository,
} from '../../domain/repositories'
import type { Transaction, Wallet, Category, Loan, Subscription } from '../../domain/entities'

export const useFinanceStore = defineStore('finance', () => {
  // Repositories
  const transactionRepo = container.resolve<ITransactionRepository>('ITransactionRepository')
  const walletRepo = container.resolve<IWalletRepository>('IWalletRepository')
  const categoryRepo = container.resolve<ICategoryRepository>('ICategoryRepository')
  const loanRepo = container.resolve<ILoanRepository>('ILoanRepository')
  const subscriptionRepo = container.resolve<ISubscriptionRepository>('ISubscriptionRepository')

  // State
  const transactions = ref<Transaction[]>([])
  const wallets = ref<Wallet[]>([])
  const categories = ref<Category[]>([])
  const loans = ref<Loan[]>([])
  const subscriptions = ref<Subscription[]>([])
  const isLoading = ref(false)

  // O(N) single-pass aggregation
  const transactionTotals = computed(() => {
    return transactions.value.reduce(
      (acc, t) => {
        if (t.type === 'income') {
          acc.income += t.amount
        } else if (t.type === 'expense') {
          acc.expense += t.amount
        }
        return acc
      },
      { income: 0, expense: 0 },
    )
  })

  // Getters
  const totalBalance = computed(() => wallets.value.reduce((sum, w) => sum + w.balance, 0))
  const totalDebt = computed(() => loans.value.reduce((sum, l) => sum + l.remaining_value, 0))

  const totalIncome = computed(() => transactionTotals.value.income)
  const totalExpense = computed(() => transactionTotals.value.expense)
  const monthlyBalance = computed(() => totalIncome.value - totalExpense.value)

  // Optimized Maps for O(1) Lookups using Plain Objects (Record) for Vue reactivity
  const categoryMap = computed(() => {
    const map: Record<string, Category> = {}
    for (const c of categories.value) {
      map[c.id] = c
    }
    return map
  })

  const walletMap = computed(() => {
    const map: Record<string, Wallet> = {}
    for (const w of wallets.value) {
      map[w.id] = w
    }
    return map
  })

  // Top Categories Single Pass
  const topCategories = computed(() => {
    const catMap: Record<string, number> = {}

    // Calculate total explicitly using loop
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

  // Actions
  async function fetchWallets() {
    wallets.value = await walletRepo.getAll()
  }

  async function fetchCategories() {
    categories.value = await categoryRepo.getAll()
  }

  async function fetchLoans() {
    loans.value = await loanRepo.getAll()
  }

  async function fetchSubscriptions() {
    subscriptions.value = await subscriptionRepo.getAll()
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
    // Refresh lists locally
    const date = new Date(transaction.date)
    await fetchTransactionsByMonth(date.getFullYear(), date.getMonth() + 1)
  }

  async function deleteTransaction(id: string) {
    await transactionRepo.delete(id)
    transactions.value = transactions.value.filter((t) => t.id !== id)
  }

  async function saveLoan(loan: Loan) {
    await loanRepo.save(loan)
    await fetchLoans()
  }

  async function deleteLoan(id: string) {
    await loanRepo.delete(id)
    await fetchLoans()
  }

  async function saveSubscription(subscription: Subscription) {
    await subscriptionRepo.save(subscription)
    await fetchSubscriptions()
  }

  async function deleteSubscription(id: string) {
    await subscriptionRepo.delete(id)
    await fetchSubscriptions()
  }

  return {
    transactions,
    wallets,
    categories,
    loans,
    subscriptions,
    isLoading,
    totalBalance,
    categoryMap,
    walletMap,
    totalIncome,
    totalExpense,
    monthlyBalance,
    topCategories,
    totalDebt,
    fetchWallets,
    fetchCategories,
    fetchLoans,
    fetchSubscriptions,
    fetchTransactionsByMonth,
    saveTransaction,
    deleteTransaction,
    saveLoan,
    deleteLoan,
    saveSubscription,
    deleteSubscription,
  }
})
