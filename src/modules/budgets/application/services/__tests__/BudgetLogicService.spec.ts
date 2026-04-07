import { describe, it, expect } from 'vitest'
import { BudgetLogicService } from '../BudgetLogicService'
import type { Budget } from '@/shared/domain/entities/Budget'
import type { Transaction } from '@/shared/domain/entities/Transaction'

describe('BudgetLogicService', () => {
  const service = new BudgetLogicService()

  const mockBudget: Budget = {
    id: '1',
    user_id: 'user1',
    name: 'Food',
    type: 'spending',
    limit_value: 1000,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
    categories: ['cat1'],
  }

  const mockTransactions: Transaction[] = [
    {
      id: 't1',
      title: 'Lunch',
      amount: 50,
      type: 'expense',
      date: '2026-03-10',
      category_id: 'cat1',
      wallet_id: 'w1',
      user_id: 'user1',
      syncStatus: 'synced',
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
      syncStatus: 'synced',
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
      syncStatus: 'synced',
      deleted: false,
      created_at: '',
      updated_at: '',
    },
  ]

  it('calculates consumption correctly', () => {
    const consumed = service.calculateConsumption(mockBudget, mockTransactions)
    expect(consumed).toBe(150) // Lunch (50) + Dinner (100)
  })

  it('checks over budget correctly', () => {
    expect(service.isOverBudget(mockBudget, 150)).toBe(false)
    expect(service.isOverBudget(mockBudget, 1100)).toBe(true)
  })

  it('calculates daily cadence correctly', () => {
    const cadence = service.calculateDailyCadence(mockBudget, 10)
    expect(cadence).toBe(100) // 1000 / 10
  })
})
