import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '../application/stores/budgetStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { db } from '@/infrastructure/storage/VaultDatabase'
import type { Budget } from '@/shared/domain/entities/Budget'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'

// Mock SyncEngine
vi.mock('@/core/sync/SyncEngine', () => {
  class MockSyncEngine {
    static getInstance = vi.fn(() => ({
      enqueueSync: vi.fn(),
    }))
    enqueueSync = vi.fn()
  }
  return {
    SyncEngine: MockSyncEngine,
    default: MockSyncEngine,
  }
})

// Mock AuthStore
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'u1' },
  })),
}))

describe('Budgets Integration', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await db.budgets.clear()
    await db.transactions.clear()
    await db.categories.clear()
  })

  it('should reactively update budget consumption when transactions change', async () => {
    // 1. Setup Data
    const category = { id: 'c1', name: 'Food', user_id: 'u1', deleted: false } as Category
    await db.categories.add(category)

    const budgetStore = useBudgetStore()
    const transactionStore = useTransactionStore()

    // 2. Initialize Store
    budgetStore.initialize()

    // 3. Create Budget
    await budgetStore.saveBudget({
      id: 'b1',
      category_id: 'c1',
      limit_value: 1000,
      period: 'monthly',
      user_id: 'u1',
    } as Budget)

    // Wait for liveQuery
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(budgetStore.budgets.length).toBe(1)

    // 4. Initial Consumption (0)
    expect(budgetStore.getConsumed(budgetStore.budgets[0]!)).toBe(0)

    // 5. Add Transaction
    await transactionStore.saveTransaction({
      id: 't1',
      title: 'Dinner',
      amount: 150,
      category_id: 'c1',
      wallet_id: 'w1',
      date: new Date().toISOString(),
      type: 'expense',
    } as Transaction)

    // 6. Verify Reactive Update
    // In a real integration, we'd wait for transactionStore to update its internal 'transactions' ref
    // But transactionStore update logic might be complex.
    // For this test, let's assume transactionStore.transactions is updated by saveTransaction call.

    // Wait for any async effects
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Check if consumed increased
    const consumed = budgetStore.getConsumed(budgetStore.budgets[0]!)
    expect(consumed).toBe(150)

    budgetStore.dispose()
  })
})
