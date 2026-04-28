import type { IGoal } from '@/modules/goals/core/entities/IGoal'
import type { IGoalLogicService } from '../../domain/contracts/IGoalLogicService'

export class GoalLogicService implements IGoalLogicService {
  /**
   * Calculates the percentage progress towards a goal.
   */
  calculateProgressPercentage(goal: IGoal): number {
    if (goal.target_value <= 0n) return 0
    const progress = (Number(goal.current_value) / Number(goal.target_value)) * 100
    return Math.min(progress, 100)
  }

  /**
   * Estimates the date when a goal will be completed based on average monthly savings.
   */
  estimateCompletionDate(goal: IGoal, averageMonthlySaving: number): Date | null {
    if (averageMonthlySaving <= 0) return null
    const remainingValue = Number(BigInt(goal.target_value) - BigInt(goal.current_value))
    if (remainingValue <= 0) return new Date()

    const monthsRemaining = remainingValue / averageMonthlySaving
    const completionDate = new Date()
    completionDate.setMonth(completionDate.getMonth() + Math.ceil(monthsRemaining))

    return completionDate
  }
}
