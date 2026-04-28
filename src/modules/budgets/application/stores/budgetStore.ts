import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IBudgetRepository } from '@/shared/domain/contracts/IBudgetRepository'
import type { Budget } from '@/shared/domain/entities/Budget'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { useAuthStore } from '@/modules/auth/application/authStore'
import type { Subscription } from 'rxjs'

export const useBudgetStore = defineStore('budgets', () => {
  const budgetRepo = container.resolve<IBudgetRepository>(DI_TOKENS.BudgetRepository)
  const transactionStore = useTransactionStore()
  const authStore = useAuthStore()

  const budgets = ref<Budget[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  let budgetSubscription: Subscription | null = null

  function initialize() {
    isLoading.value = true
    budgetSubscription = budgetRepo.watchAll().subscribe({
      next: (data) => {
        budgets.value = data
        isLoading.value = false
      },
      error: (err) => {
        console.error('BudgetStore: Error watching budgets', err)
        isLoading.value = false
      },
    })
  }

  function dispose() {
    budgetSubscription?.unsubscribe()
  }

  const getConsumed = (budget: Budget) => {
    // Current month transactions from transactionStore (which are already filtered/reactive)
    const consumed = transactionStore.transactions
      .filter((t) => t.category_id === budget.category_id && !t.deleted && t.type === 'expense')
      .reduce((acc, t) => acc + BigInt(t.amount), 0n)
    return Number(consumed)
  }


  const totalBudgeted = computed(() => Number(budgets.value.reduce((sum, b) => sum + BigInt(b.limit_value), 0n)))
  const totalConsumed = computed(() => budgets.value.reduce((sum, b) => sum + getConsumed(b), 0))

  async function saveBudget(budget: Budget) {
    const budgetToSave = !budget.user_id && authStore.user?.id
      ? { ...budget, user_id: authStore.user.id }
      : budget
    try {
      await budgetRepo.save(budgetToSave)
    } catch (err) {
      const errorContext = {
        operation: 'saveBudget',
        budgetId: budget.id,
        categoryId: budget.category_id,
        userId: authStore.user?.id,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[BudgetStore] Failed to save budget:', errorContext, err)
      throw err
    }
  }

  async function deleteBudget(id: string) {
    try {
      await budgetRepo.delete(id)
    } catch (err) {
      const errorContext = {
        operation: 'deleteBudget',
        budgetId: id,
        userId: authStore.user?.id,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[BudgetStore] Failed to delete budget:', errorContext, err)
      throw err
    }
  }

  return {
    budgets,
    isLoading,
    searchQuery,
    totalBudgeted,
    totalConsumed,
    initialize,
    dispose,
    getConsumed,
    saveBudget,
    deleteBudget,
  }
})
