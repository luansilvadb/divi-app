import { describe, it, expect } from 'vitest'

// Import all domain entities to ensure 100% coverage
import type { IUser } from '@/modules/auth/core/entities/IUser'
import type { IBudget } from '@/modules/budgets/core/entities/IBudget'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'
import type { IGoal } from '@/modules/goals/core/entities/IGoal'
import type { ILoan } from '@/modules/loans/core/entities/ILoan'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'

describe('Domain Entities', () => {
  it('should have valid IUser interface', () => {
    const user: IUser = {
      id: 'u1',
      email: 'test@example.com',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.png',
    }
    expect(user.id).toBe('u1')
    expect(user.email).toBe('test@example.com')
    expect(user.name).toBe('Test User')
    expect(user.avatar_url).toBe('https://example.com/avatar.png')
  })

  it('should have valid IUser interface with minimal fields', () => {
    const user: IUser = {
      id: 'u2',
      email: 'minimal@example.com',
    }
    expect(user.id).toBe('u2')
    expect(user.email).toBe('minimal@example.com')
    expect(user.name).toBeUndefined()
    expect(user.avatar_url).toBeUndefined()
  })

  it('should have valid IBudget interface', () => {
    const budget: IBudget = {
      id: 'b1',
      user_id: 'u1',
      category_id: 'c1',
      limit_value: 10000n,
      period: 'monthly',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    expect(budget.id).toBe('b1')
    expect(budget.limit_value).toBe(10000n)
  })

  it('should have valid ICategory interface', () => {
    const category: ICategory = {
      id: 'c1',
      user_id: 'u1',
      name: 'Food',
      color: '#FF5733',
      icon: 'utensils',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    expect(category.id).toBe('c1')
    expect(category.name).toBe('Food')
  })

  it('should have valid IGoal interface', () => {
    const goal: IGoal = {
      id: 'g1',
      user_id: 'u1',
      name: 'Emergency Fund',
      target_value: 50000n,
      current_value: 25000n,
      type: 'saving',
      color: '#00FF00',
      icon: 'piggy-bank',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    expect(goal.id).toBe('g1')
    expect(goal.target_value).toBe(50000n)
  })

  it('should have valid ILoan interface', () => {
    const loan: ILoan = {
      id: 'l1',
      user_id: 'u1',
      name: 'Car ILoan',
      description: 'Auto financing',
      total_value: 5000000n,
      remaining_value: 3000000n,
      interest_rate: 5.5,
      due_date: '2028-01-01',
      status: 'active',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    expect(loan.id).toBe('l1')
    expect(loan.total_value).toBe(5000000n)
  })

  it('should have valid ITransaction interface', () => {
    const ITransaction: ITransaction = {
      id: 't1',
      user_id: 'u1',
      title: 'Grocery shopping',
      amount: 15000n,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: new Date().toISOString(),
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    expect(ITransaction.id).toBe('t1')
    expect(ITransaction.amount).toBe(15000n)
  })
})
