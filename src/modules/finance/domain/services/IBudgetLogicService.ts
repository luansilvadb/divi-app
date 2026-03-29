import type { Budget, Transaction } from '../entities'

export interface IBudgetLogicService {
  /**
   * Calculates the recommended daily spending limit based on remaining budget and days.
   */
  calculateDailyCadence(budget: Budget, daysRemaining: number): number

  /**
   * Calculates the total amount consumed within a budget by filtering transactions.
   */
  calculateConsumption(budget: Budget, transactions: Transaction[]): number

  /**
   * Checks if a budget has been exceeded.
   */
  isOverBudget(budget: Budget, consumed: number): boolean
}
