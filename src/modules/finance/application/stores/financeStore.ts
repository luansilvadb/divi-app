import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '../../../../core/di'
import type { ITransactionRepository, IWalletRepository, ICategoryRepository, ILoanRepository, ISubscriptionRepository } from '../../domain/repositories'
import type { Transaction, Wallet, Category, Loan, Subscription } from '../../domain/entities'

export const useFinanceStore = defineStore('finance', () => {
  const transactionRepo = container.resolve<ITransactionRepository>('ITransactionRepository')
  const walletRepo = container.resolve<IWalletRepository>('IWalletRepository')
  const categoryRepo = container.resolve<ICategoryRepository>('ICategoryRepository')
  const loanRepo = container.resolve<ILoanRepository>('ILoanRepository')
  const subscriptionRepo = container.resolve<ISubscriptionRepository>('ISubscriptionRepository')

  const transactions = ref<Transaction[]>([])
  const wallets = ref<Wallet[]>([])
  const categories = ref<Category[]>([])
  const loans = ref<Loan[]>([])
  const subscriptions = ref<Subscription[]>([])
  const isLoading = ref(false)

  const transactionTotals = computed(() =>
    transactions.value.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.income += t.amount
        else if (t.type === 'expense') acc.expense += t.amount
        return acc
      },
      { income: 0, expense: 0 }
    )
  )

  const totalBalance = computed(() => wallets.value.reduce((sum, w) => sum + w.balance, 0))
  const totalDebt = computed(() => loans.value.reduce((sum, l) => sum + l.remaining_value, 0))
  const totalIncome = computed(() => transactionTotals.value.income)
  const totalExpense = computed(() => transactionTotals.value.expense)
  const monthlyBalance = computed(() => totalIncome.value - totalExpense.value)

  const categoryMap = computed(() => categories.value.reduce((map, c) => ((map[c.id] = c), map), {} as Record<string, Category>))
  const walletMap = computed(() => wallets.value.reduce((map, w) => ((map[w.id] = w), map), {} as Record<string, Wallet>))

  const topCategories = computed(() => {
    const map = transactions.value.reduce((acc, t) => {
      if (t.type === 'expense') acc[t.category_id] = (acc[t.category_id] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

    const total = totalExpense.value
    if (!total) return []

    return Object.entries(map)
      .map(([id, amount]) => {
        const cat = categoryMap.value[id]
        return {
          id,
          name: cat?.name || 'Outros',
          color: cat?.color || '#9ca3af',
          total: amount,
          percent: (amount / total) * 100,
        }
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  })

  async function fetchWallets() { wallets.value = await walletRepo.getAll() }
  async function fetchCategories() { categories.value = await categoryRepo.getAll() }
  async function fetchLoans() { loans.value = await loanRepo.getAll() }
  async function fetchSubscriptions() { subscriptions.value = await subscriptionRepo.getAll() }

  async function fetchTransactionsByMonth(year: number, month: number) {
    isLoading.value = true
    try { transactions.value = await transactionRepo.getByMonth(year, month) }
    finally { isLoading.value = false }
  }

  async function saveTransaction(t: Transaction) {
    await transactionRepo.save(t)
    const d = new Date(t.date)
    await fetchTransactionsByMonth(d.getFullYear(), d.getMonth() + 1)
  }

  async function deleteTransaction(id: string) {
    await transactionRepo.delete(id)
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  async function saveLoan(loan: Loan) { await loanRepo.save(loan); await fetchLoans() }
  async function deleteLoan(id: string) { await loanRepo.delete(id); await fetchLoans() }
  async function saveSubscription(sub: Subscription) { await subscriptionRepo.save(sub); await fetchSubscriptions() }
  async function deleteSubscription(id: string) { await subscriptionRepo.delete(id); await fetchSubscriptions() }

  return {
    transactions, wallets, categories, loans, subscriptions, isLoading,
    totalBalance, categoryMap, walletMap, totalIncome, totalExpense,
    monthlyBalance, topCategories, totalDebt,
    fetchWallets, fetchCategories, fetchLoans, fetchSubscriptions,
    fetchTransactionsByMonth, saveTransaction, deleteTransaction,
    saveLoan, deleteLoan, saveSubscription, deleteSubscription,
  }
})
