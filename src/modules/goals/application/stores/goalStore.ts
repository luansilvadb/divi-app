import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IGoalRepository } from '../../core/ports/IGoalRepository'
import type { IGoal } from '@/modules/goals/core/entities/IGoal'

export const useGoalStore = defineStore('goals', () => {
  const goalRepo = container.resolve<IGoalRepository>(DI_TOKENS.IGoalRepository)

  const goals = ref<IGoal[]>([])
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

  const saveGoal = async (goal: IGoal) => {
    try {
      await goalRepo.save(goal)
      await fetchGoals()
    } catch (err) {
      const errorContext = {
        operation: 'saveGoal',
        goalId: goal.id,
        goalName: goal.name,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[GoalStore] Failed to save goal:', errorContext, err)
      throw err
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      await goalRepo.delete(id)
      await fetchGoals()
    } catch (err) {
      const errorContext = {
        operation: 'deleteGoal',
        goalId: id,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[GoalStore] Failed to delete goal:', errorContext, err)
      throw err
    }
  }

  const totalSaved = computed(() => Number(goals.value.reduce((sum, g) => sum + BigInt(g.current_value), 0n)))
  const totalTarget = computed(() => Number(goals.value.reduce((sum, g) => sum + BigInt(g.target_value), 0n)))

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
