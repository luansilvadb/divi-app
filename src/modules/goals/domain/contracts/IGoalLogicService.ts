import type { IGoal } from '@/modules/goals/core/entities/IGoal'

export interface IGoalLogicService {
  /**
   * Calculates the percentage progress towards a goal.
   */
  calculateProgressPercentage(goal: IGoal): number

  /**
   * Estimates the date when a goal will be completed based on average monthly savings.
   */
  estimateCompletionDate(goal: IGoal, averageMonthlySaving: number): Date | null
}
