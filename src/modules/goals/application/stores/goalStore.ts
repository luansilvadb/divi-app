import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IGoalRepository } from '@/shared/domain/contracts/IGoalRepository'
import type { Goal } from '@/shared/domain/entities/Goal'

export const useGoalStore = defineStore('goals', () => {
  const goalRepo = container.resolve<IGoalRepository>(DI_TOKENS.GoalRepository)

  const goals = ref<Goal[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')

  const fetchGoals = async () => {
    isLoading.value = true
    try {
      goals.value = await goalRepo.getAll()
    } finally {
      isLoading.value = false
    }
  }

  const saveGoal = async (goal: Goal) => {
    await goalRepo.save(goal)
    await fetchGoals()
  }

  const deleteGoal = async (id: string) => {
    await goalRepo.delete(id)
    await fetchGoals()
  }

  const totalSaved = computed(() => goals.value.reduce((sum, g) => sum + g.current_value, 0))
  const totalTarget = computed(() => goals.value.reduce((sum, g) => sum + g.target_value, 0))

  return {
    goals,
    isLoading,
    searchQuery,
    fetchGoals,
    saveGoal,
    deleteGoal,
    totalSaved,
    totalTarget,
  }
})

