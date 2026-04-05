"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetLogicService = void 0;
var BudgetLogicService = /** @class */ (function () {
    function BudgetLogicService() {
    }
    /**
     * Calculates the recommended daily spending limit based on remaining budget and days.
     * Daily Cadence = (Total Limit - Consumed) / Days Remaining
     */
    BudgetLogicService.prototype.calculateDailyCadence = function (budget, daysRemaining) {
        if (daysRemaining <= 0)
            return 0;
        return budget.limit_value / daysRemaining;
    };
    /**
     * Calculates the total amount consumed within a budget by filtering transactions.
     * Matches by Category and Wallet if specified in the budget.
     */
    BudgetLogicService.prototype.calculateConsumption = function (budget, transactions) {
        var consumption = transactions
            .filter(function (tx) {
            // Filter by date range
            var txDate = new Date(tx.date);
            var startDate = new Date(budget.period_start);
            var endDate = new Date(budget.period_end);
            if (txDate < startDate || txDate > endDate)
                return false;
            // Filter by category if specified
            if (budget.categories && budget.categories.length > 0) {
                if (!budget.categories.includes(tx.category_id))
                    return false;
            }
            // Filter by wallet if specified
            if (budget.wallets && budget.wallets.length > 0) {
                if (!budget.wallets.includes(tx.wallet_id))
                    return false;
            }
            // Only count expenses (negative values) for consumption
            return tx.type === 'expense';
        })
            .reduce(function (total, tx) { return total + Math.abs(tx.amount); }, 0);
        return consumption;
    };
    /**
     * Checks if a budget has been exceeded.
     */
    BudgetLogicService.prototype.isOverBudget = function (budget, consumed) {
        return consumed > budget.limit_value;
    };
    return BudgetLogicService;
}());
exports.BudgetLogicService = BudgetLogicService;
