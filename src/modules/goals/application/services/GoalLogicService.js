"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalLogicService = void 0;
var GoalLogicService = /** @class */ (function () {
    function GoalLogicService() {
    }
    /**
     * Calculates the percentage progress towards a goal.
     */
    GoalLogicService.prototype.calculateProgressPercentage = function (goal) {
        if (goal.target_value <= 0)
            return 0;
        var progress = (goal.current_value / goal.target_value) * 100;
        return Math.min(progress, 100);
    };
    /**
     * Estimates the date when a goal will be completed based on average monthly savings.
     */
    GoalLogicService.prototype.estimateCompletionDate = function (goal, averageMonthlySaving) {
        if (averageMonthlySaving <= 0)
            return null;
        var remainingValue = goal.target_value - goal.current_value;
        if (remainingValue <= 0)
            return new Date();
        var monthsRemaining = remainingValue / averageMonthlySaving;
        var completionDate = new Date();
        completionDate.setMonth(completionDate.getMonth() + Math.ceil(monthsRemaining));
        return completionDate;
    };
    return GoalLogicService;
}());
exports.GoalLogicService = GoalLogicService;
