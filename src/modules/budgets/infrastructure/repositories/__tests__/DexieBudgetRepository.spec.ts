import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DexieBudgetRepository } from '../DexieBudgetRepository'
import { db } from '@/core/db'

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

  it('should save and get active budgets', async () => {
    await repo.save({
      id: 'b1',
      category_id: 'c1',
      limit_value: 100,
      period: 'monthly',
      deleted: false,
    } as any)

    await repo.save({
      id: 'b2',
      category_id: 'c2',
      limit_value: 200,
      period: 'monthly',
      deleted: true,
    } as any)

    const active = await repo.getAllActive()
    expect(active.length).toBe(1)
    expect(active[0]!.id).toBe('b1')
  })

  it('should delete a budget (soft delete)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await repo.save({ id: 'b3', deleted: false } as any)
    await repo.delete('b3')

    const budget = await db.budgets.get('b3')
    expect(budget?.deleted).toBe(true)
    expect(budget?.sync_status).toBe('pending')
  })

  it('should provide a watchable observable', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const budgets: any[] = []
    const sub = repo.watchAll().subscribe((b) => budgets.push(b))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await repo.save({ id: 'b4', deleted: false } as any)

    // Wait for liveQuery
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(budgets.length).toBeGreaterThan(0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(budgets[budgets.length - 1].some((b: any) => b.id === 'b4')).toBe(true)

    sub.unsubscribe()
  })
})
