import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IBudgetRepository } from '@/shared/domain/contracts/IBudgetRepository'
import type { Budget } from '@/shared/domain/entities/Budget'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import type { Subscription } from 'rxjs'

export const useBudgetStore = defineStore('budgets', () => {
  const budgetRepo = container.resolve<IBudgetRepository>(DI_TOKENS.BudgetRepository)
  const transactionStore = useTransactionStore()

  const budgets = ref<Budget[]>([])
  const isLoading = ref(false)
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
      }
    })
  }

  function dispose() {
    budgetSubscription?.unsubscribe()
  }

  const getConsumed = (budget: Budget) => {
    // Current month transactions from transactionStore (which are already filtered/reactive)
    return transactionStore.transactions
      .filter(t => t.category_id === budget.category_id && !t.deleted)
      .reduce((acc, t) => acc + t.amount, 0)
  }

  async function saveBudget(budget: Budget) {
    await budgetRepo.save(budget)
  }

  async function deleteBudget(id: string) {
    await budgetRepo.delete(id)
  }

  return {
    budgets,
    isLoading,
    initialize,
    dispose,
    getConsumed,
    saveBudget,
    deleteBudget
  }
})
