"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var BudgetLogicService_1 = require("../BudgetLogicService");
(0, vitest_1.describe)('BudgetLogicService', function () {
    var service = new BudgetLogicService_1.BudgetLogicService();
    var mockBudget = {
        id: '1',
        user_id: 'user1',
        name: 'Food',
        type: 'spending',
        limit_value: 1000,
        period_start: '2026-03-01',
        period_end: '2026-03-31',
        categories: ['cat1'],
    };
    var mockTransactions = [
        {
            id: 't1',
            title: 'Lunch',
            amount: 50,
            type: 'expense',
            date: '2026-03-10',
            category_id: 'cat1',
            wallet_id: 'w1',
            user_id: 'user1',
            synced: true,
            deleted: false,
            created_at: '',
            updated_at: '',
        },
        {
            id: 't2',
            title: 'Salary',
            amount: 5000,
            type: 'income',
            date: '2026-03-05',
            category_id: 'cat2',
            wallet_id: 'w1',
            user_id: 'user1',
            synced: true,
            deleted: false,
            created_at: '',
            updated_at: '',
        },
        {
            id: 't3',
            title: 'Dinner',
            amount: 100,
            type: 'expense',
            date: '2026-03-15',
            category_id: 'cat1',
            wallet_id: 'w1',
            user_id: 'user1',
            synced: true,
            deleted: false,
            created_at: '',
            updated_at: '',
        },
    ];
    (0, vitest_1.it)('calculates consumption correctly', function () {
        var consumed = service.calculateConsumption(mockBudget, mockTransactions);
        (0, vitest_1.expect)(consumed).toBe(150); // Lunch (50) + Dinner (100)
    });
    (0, vitest_1.it)('checks over budget correctly', function () {
        (0, vitest_1.expect)(service.isOverBudget(mockBudget, 150)).toBe(false);
        (0, vitest_1.expect)(service.isOverBudget(mockBudget, 1100)).toBe(true);
    });
    (0, vitest_1.it)('calculates daily cadence correctly', function () {
        var cadence = service.calculateDailyCadence(mockBudget, 10);
        (0, vitest_1.expect)(cadence).toBe(100); // 1000 / 10
    });
});
