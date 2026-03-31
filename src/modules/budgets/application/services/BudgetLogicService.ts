import type { Budget } from '@/shared/domain/entities/Budget'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { IBudgetLogicService } from '../../domain/contracts/IBudgetLogicService'

export class BudgetLogicService implements IBudgetLogicService {
  /**
   * Calculates the recommended daily spending limit based on remaining budget and days.
   * Daily Cadence = (Total Limit - Consumed) / Days Remaining
   */
  calculateDailyCadence(budget: Budget, daysRemaining: number): number {
    if (daysRemaining <= 0) return 0
    return budget.limit_value / daysRemaining
  }

  /**
   * Calculates the total amount consumed within a budget by filtering transactions.
   * Matches by Category and Wallet if specified in the budget.
   */
  calculateConsumption(budget: Budget, transactions: Transaction[]): number {
    const consumption = transactions
      .filter((tx) => {
        // Filter by date range
        const txDate = new Date(tx.date)
        const startDate = new Date(budget.period_start)
        const endDate = new Date(budget.period_end)

        if (txDate < startDate || txDate > endDate) return false

        // Filter by category if specified
        if (budget.categories && budget.categories.length > 0) {
          if (!budget.categories.includes(tx.category_id)) return false
        }

        // Filter by wallet if specified
        if (budget.wallets && budget.wallets.length > 0) {
          if (!budget.wallets.includes(tx.wallet_id)) return false
        }

        // Only count expenses (negative values) for consumption
        return tx.type === 'expense'
      })
      .reduce((total, tx) => total + Math.abs(tx.amount), 0)

    return consumption
  }

  /**
   * Checks if a budget has been exceeded.
   */
  isOverBudget(budget: Budget, consumed: number): boolean {
    return consumed > budget.limit_value
  }
}
