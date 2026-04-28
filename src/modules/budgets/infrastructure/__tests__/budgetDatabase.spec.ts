import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/infrastructure/storage/VaultDatabase'
import type { LocalBudget } from '@/infrastructure/storage/VaultDatabase'

describe('Budget Database (Dexie)', () => {
  beforeEach(async () => {
    await db.budgets.clear()
  })

  it('should create and retrieve a budget with the correct schema', async () => {
    const budget: LocalBudget = {
      id: 'budget-1',
      user_id: 'user-1',
      category_id: 'cat-1',
      limit_value: 1000n,
      period: 'monthly',
      sync_status: 'pending',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }

    await db.budgets.add(budget)
    const retrieved = await db.budgets.get('budget-1')

    expect(retrieved).toBeDefined()
    expect(retrieved?.category_id).toBe('cat-1')
    expect(retrieved?.limit_value).toBe(1000n)
    expect(retrieved?.period).toBe('monthly')
  })

  it('should automatically set sync_status to pending when creating a budget', async () => {
    const budget: Partial<LocalBudget> = {
      id: 'budget-2',
      user_id: 'user-1',
      category_id: 'cat-2',
      limit_value: 500n,
      period: 'monthly',
    }

    await db.budgets.add(budget as LocalBudget)
    const retrieved = await db.budgets.get('budget-2')

    expect(retrieved?.sync_status).toBe('pending')
    expect(retrieved?.client_updated_at).toBeDefined()
  })

  it('should automatically set sync_status to pending when updating a budget', async () => {
    const budget: LocalBudget = {
      id: 'budget-3',
      user_id: 'user-1',
      category_id: 'cat-3',
      limit_value: 800n,
      period: 'monthly',
      sync_status: 'synced',
      client_updated_at: '2026-01-01T00:00:00.000Z',
      created_at: '2026-01-01T00:00:00.000Z',
      version: 1,
      deleted: false,
    }

    await db.budgets.add(budget)

    // Update without setting sync_status
    await db.budgets.update('budget-3', { limit_value: 900n })

    const retrieved = await db.budgets.get('budget-3')
    expect(retrieved?.limit_value).toBe(900n)
    expect(retrieved?.sync_status).toBe('pending')
  })
})
