import type { Goal } from '@/shared/domain/entities/Goal'
import type { IGoalLogicService } from '../../domain/contracts/IGoalLogicService'

export class GoalLogicService implements IGoalLogicService {
  /**
   * Calculates the percentage progress towards a goal.
   */
  calculateProgressPercentage(goal: Goal): number {
    if (goal.target_value <= 0) return 0
    const progress = (goal.current_value / goal.target_value) * 100
    return Math.min(progress, 100)
  }

  /**
   * Estimates the date when a goal will be completed based on average monthly savings.
   */
  estimateCompletionDate(goal: Goal, averageMonthlySaving: number): Date | null {
    if (averageMonthlySaving <= 0) return null
    const remainingValue = goal.target_value - goal.current_value
    if (remainingValue <= 0) return new Date()

    const monthsRemaining = remainingValue / averageMonthlySaving
    const completionDate = new Date()
    completionDate.setMonth(completionDate.getMonth() + Math.ceil(monthsRemaining))

    return completionDate
  }
}
