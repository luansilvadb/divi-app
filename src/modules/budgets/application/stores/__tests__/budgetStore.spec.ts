import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '../budgetStore'
import { db } from '@/infrastructure/storage/VaultDatabase'
import type { Budget } from '@/shared/domain/entities/Budget'

// Mock SyncEngine - must be before other imports that use it
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

// Mock TransactionStore
vi.mock('@/modules/transactions/application/stores/transactionStore', () => ({
  useTransactionStore: vi.fn(() => ({
    transactions: [
      { id: 't1', category_id: 'c1', amount: 100, deleted: false, type: 'expense' },
      { id: 't2', category_id: 'c1', amount: 200, deleted: false, type: 'expense' },
      { id: 't3', category_id: 'c2', amount: 50, deleted: false, type: 'expense' },
      { id: 't4', category_id: 'c1', amount: 300, deleted: true, type: 'expense' }, // Should be ignored
      { id: 't5', category_id: 'c1', amount: 500, deleted: false, type: 'income' }, // Should be ignored
    ],
    categoryMap: {
      c1: { id: 'c1', name: 'Lazer' },
    },
  })),
}))

// Mock AuthStore
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'u1' },
  })),
}))

describe('BudgetStore', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await db.budgets.clear()
  })

  it('should calculate consumed amount correctly', async () => {
    const store = useBudgetStore()

    const budget = {
      id: 'b1',
      category_id: 'c1',
      limit_value: 1000,
      period: 'monthly',
    } as Budget

    const consumed = store.getConsumed(budget)
    expect(consumed).toBe(300) // 100 + 200
  })

  it('should initialize and watch budgets', async () => {
    const store = useBudgetStore()

    // Add budget to Dexie
    await db.budgets.add({
      id: 'b1',
      user_id: 'u1',
      category_id: 'c1',
      limit_value: 1000,
      period: 'monthly',
      sync_status: 'synced',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    })

    store.initialize()

    // Since liveQuery is async, we need to wait a bit
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(store.budgets.length).toBe(1)
    expect(store.budgets[0]!.id).toBe('b1')

    store.dispose()
  })

  it('should save a budget with user_id', async () => {
    const store = useBudgetStore()
    const budget = { id: 'b-new', limit_value: 123 } as Budget
    await store.saveBudget(budget)
    const saved = await db.budgets.get('b-new')
    expect(saved?.user_id).toBe('u1')
    expect(saved?.limit_value).toBe(123n)
  })

  it('should delete a budget', async () => {
    const store = useBudgetStore()
    await db.budgets.add({ id: 'b-del', deleted: false } as Budget)
    await store.deleteBudget('b-del')
    const deleted = await db.budgets.get('b-del')
    expect(deleted?.deleted).toBe(true)
  })

  it('should not mutate the original budget object when saving', async () => {
    const store = useBudgetStore()
    const originalBudget: Budget = {
      id: 'b-immutable',
      user_id: '', // Empty to trigger user_id assignment
      category_id: 'c1',
      limit_value: 500n,
      period: 'monthly',
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }

    // Create a frozen copy to ensure immutability
    const budgetToSave = Object.freeze({ ...originalBudget })

    // Should not throw when saving (would throw if it tried to mutate)
    await store.saveBudget(budgetToSave)

    // Verify the saved budget has user_id
    const saved = await db.budgets.get('b-immutable')
    expect(saved?.user_id).toBe('u1')
    expect(saved?.limit_value).toBe(500n)
  })
})
