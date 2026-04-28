import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '../application/stores/budgetStore'
import { usetransactionstore } from '@/modules/transactions/application/stores/transactionstore'
import { db } from '@/infrastructure/storage/VaultDatabase'
import type { IBudget } from '@/modules/budgets/core/entities/IBudget'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'

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
    const category = { id: 'c1', name: 'Food', user_id: 'u1', deleted: false } as any
    await db.categories.add(category)

    const budgetStore = useBudgetStore()
    const transactionstore = usetransactionstore()

    // 2. Initialize Store
    budgetStore.initialize()

    // 3. Create IBudget
    await budgetStore.saveBudget({
      category_id: 'c1',
      limit_value: 1000n,
      period: 'monthly',
    } as any)

    // Wait for liveQuery
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(budgetStore.budgets.length).toBe(1)

    // 4. Initial Consumption (0)
    expect(budgetStore.getConsumed(budgetStore.budgets[0]!)).toBe(0)

    // 5. Add ITransaction
    await transactionstore.saveITransaction({
      id: 't1',
      title: 'Dinner',
      amount: 150n,
      category_id: 'c1',
      wallet_id: 'w1',
      date: new Date().toISOString(),
      type: 'expense',
    } as any)

    // 6. Verify Reactive Update
    // In a real integration, we'd wait for transactionstore to update its internal 'transactions' ref
    // But transactionstore update logic might be complex.
    // For this test, let's assume transactionstore.transactions is updated by saveITransaction call.

    // Wait for any async effects
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Check if consumed increased
    const consumed = budgetStore.getConsumed(budgetStore.budgets[0]!)
    expect(consumed).toBe(150)

    budgetStore.dispose()
  })
})
