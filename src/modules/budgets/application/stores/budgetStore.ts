import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IBudgetRepository } from '@/shared/domain/contracts/IBudgetRepository'
import type { IBudgetLogicService } from '../../domain/contracts/IBudgetLogicService'
import type { Budget } from '@/shared/domain/entities/Budget'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'

export const useBudgetStore = defineStore('budgets', () => {
  const budgetRepo = container.resolve<IBudgetRepository>(DI_TOKENS.BudgetRepository)
  const budgetLogic = container.resolve<IBudgetLogicService>(DI_TOKENS.BudgetLogicService)
  const transactionStore = useTransactionStore()

  const budgets = ref<Budget[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')

  const fetchBudgets = async () => {
    isLoading.value = true
    try {
      budgets.value = await budgetRepo.getAllActive()
    } finally {
      isLoading.value = false
    }
  }

  const getConsumed = (budget: Budget) => {
    return budgetLogic.calculateConsumption(budget, transactionStore.transactions)
  }

  const totalBudgeted = computed(() => budgets.value.reduce((sum, b) => sum + b.limit_value, 0))

  const totalConsumed = computed(() => budgets.value.reduce((sum, b) => sum + getConsumed(b), 0))

  return {
    budgets,
    isLoading,
    searchQuery,
    fetchBudgets,
    getConsumed,
    totalBudgeted,
    totalConsumed,
  }
})
