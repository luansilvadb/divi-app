import type { Goal } from '@/shared/domain/entities/Goal'

export interface IGoalLogicService {
  /**
   * Calculates the percentage progress towards a goal.
   */
  calculateProgressPercentage(goal: Goal): number

  /**
   * Estimates the date when a goal will be completed based on average monthly savings.
   */
  estimateCompletionDate(goal: Goal, averageMonthlySaving: number): Date | null
}
