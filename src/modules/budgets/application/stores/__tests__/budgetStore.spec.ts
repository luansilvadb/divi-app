import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '../budgetStore'
import { db } from '@/infrastructure/storage/VaultDatabase'
import type { IBudget } from '@/modules/budgets/core/entities/IBudget'

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

// Mock transactionstore
vi.mock('@/modules/transactions/application/stores/transactionstore', () => ({
  usetransactionstore: vi.fn(() => ({
    transactions: [
      { id: 't1', category_id: 'c1', amount: 100n, deleted: false, type: 'expense' },
      { id: 't2', category_id: 'c1', amount: 200n, deleted: false, type: 'expense' },
      { id: 't3', category_id: 'c2', amount: 50n, deleted: false, type: 'expense' },
      { id: 't4', category_id: 'c1', amount: 300n, deleted: true, type: 'expense' }, // Should be ignored
      { id: 't5', category_id: 'c1', amount: 500n, deleted: false, type: 'income' }, // Should be ignored
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
      limit_value: 1000n,
      period: 'monthly',
    } as any

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
      limit_value: 1000n,
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
    const budget = { category_id: 'c1', limit_value: 123n, period: 'monthly' } as any
    await store.saveBudget(budget)
    const all = await db.budgets.toArray()
    expect(all[0]?.user_id).toBe('u1')
    expect(all[0]?.limit_value).toBe(123n)
  })

  it('should delete a budget', async () => {
    const store = useBudgetStore()
    await db.budgets.add({ id: 'b-del', user_id: 'u1', category_id: 'c1', limit_value: 100n, period: 'monthly', deleted: false } as any)
    await store.deleteBudget('b-del')
    const deleted = await db.budgets.get('b-del')
    expect(deleted?.deleted).toBe(true)
  })

  it('should not mutate the original budget object when saving', async () => {
    const store = useBudgetStore()

    // Pre-seed the budget in the DB (update path requires existing record)
    await db.budgets.add({
      id: 'b-immutable',
      user_id: 'u1',
      category_id: 'c1',
      limit_value: 200n,
      period: 'monthly',
      sync_status: 'synced',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    })

    const frozenBudget: IBudget = Object.freeze({
      id: 'b-immutable',
      user_id: 'u1',
      category_id: 'c1',
      limit_value: 500n,
      period: 'monthly',
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    })

    // Should not throw when saving a frozen object (immutability check)
    await store.saveBudget(frozenBudget)

    // Verify the updated budget has the new limit_value
    const saved = await db.budgets.get('b-immutable')
    expect(saved?.user_id).toBe('u1')
    expect(saved?.limit_value).toBe(500n)
  })
})
