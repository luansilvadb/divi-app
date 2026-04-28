import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DexieBudgetRepository } from '../DexieBudgetRepository'
import { db } from '@/infrastructure/storage/VaultDatabase'

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

describe('DexieBudgetRepository', () => {
  let repo: DexieBudgetRepository

  beforeEach(async () => {
    repo = new DexieBudgetRepository()
    await db.budgets.clear()
  })

  it('should create and get active budgets', async () => {
    await repo.create({
      user_id: 'u1',
      category_id: 'c1',
      limit_value: 100n,
      period: 'monthly',
    })

    const active = await repo.getAllActive()
    expect(active.length).toBe(1)
    expect(active[0]!.category_id).toBe('c1')
  })

  it('should delete a budget (soft delete)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await repo.create({ user_id: 'u1', category_id: 'c1', limit_value: 100n, period: 'monthly' } as any)
    await repo.delete(created.id)

    const budget = await db.budgets.get(created.id)
    expect(budget?.deleted).toBe(true)
    expect(budget?.sync_status).toBe('pending')
  })

  it('should provide a watchable observable', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const budgets: any[] = []
    const sub = repo.watchAll().subscribe((b) => budgets.push(b))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = await repo.create({ user_id: 'u1', category_id: 'c1', limit_value: 100n, period: 'monthly' } as any)

    // Wait for liveQuery
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(budgets.length).toBeGreaterThan(0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(budgets[budgets.length - 1].some((b: any) => b.id === created.id)).toBe(true)

    sub.unsubscribe()
  })
})
