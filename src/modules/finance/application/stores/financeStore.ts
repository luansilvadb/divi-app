import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '../../../../core/di'
import type { 
  ITransactionRepository, 
  IWalletRepository, 
  ICategoryRepository,
  ILoanRepository,
  ISubscriptionRepository
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

  // Getters
  const totalBalance = computed(() => 
    wallets.value.reduce((sum, w) => sum + w.balance, 0)
  )

  const totalDebt = computed(() =>
    loans.value.reduce((sum, l) => sum + l.remaining_value, 0)
  )

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
    transactions.value = transactions.value.filter(t => t.id !== id)
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
    deleteSubscription
  }
})
