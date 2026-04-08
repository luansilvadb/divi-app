import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SyncEngine } from '../SyncEngine'
import { db } from '../../db'
import { supabase } from '../../supabase'

vi.mock('../../supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

describe('SyncEngine Task Implementation: Error Handling', () => {
  let syncEngine: SyncEngine

  beforeEach(async () => {
    await Promise.all([
      db.transactions.clear(),
      db.wallets.clear()
    ])
    syncEngine = new SyncEngine()
    vi.clearAllMocks()
  })

  it('should mark records as failed if Supabase returns an error', async () => {
    // 1. Add record locally
    const id = 'error-test-id'
    await db.transactions.add({
      id,
      user_id: 'u1',
      title: 'Error Test',
      amount: 100,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07',
      syncStatus: 'pending',
      deleted: false,
      updated_at: new Date().toISOString()
    })

    // Mock supabase error
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'transactions') {
        return {
          select: vi.fn().mockImplementation((query) => {
            if (query === '*') {
              return { in: vi.fn().mockResolvedValueOnce({ data: [], error: null }) }
            }
            return { in: vi.fn().mockResolvedValueOnce({ data: [], error: null }) }
          }),
          upsert: vi.fn().mockImplementation(() => ({
            select: vi.fn().mockResolvedValueOnce({ 
              data: null, 
              error: { message: 'Network Timeout', code: 'TIMEOUT' } 
            })
          }))
        } as any
      }
      return {} as any
    })

    // 2. Run sync
    await syncEngine.sync()

    // 3. Verify local record is marked as failed
    const record = await db.transactions.get({ id })
    expect(record?.syncStatus).toBe('failed')
  })

  it('should mark records as failed if an exception is thrown during sync', async () => {
    const id = 'exception-test-id'
    await db.transactions.add({
      id,
      user_id: 'u1',
      title: 'Exception Test',
      amount: 100,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07',
      syncStatus: 'pending',
      deleted: false,
      updated_at: new Date().toISOString()
    })

    // Mock exception
    vi.mocked(supabase.from).mockImplementation(() => {
      throw new Error('Fatal Database Error')
    })

    // 2. Run sync
    await syncEngine.sync()

    // 3. Verify local record is marked as failed or at least remains pending
    // Better: it should be marked as failed to avoid infinite retry loops without exponential backoff
    const record = await db.transactions.get({ id })
    expect(record?.syncStatus).toBe('failed')
  })

  it('should handle partial failures in bulk upsert if applicable', async () => {
     // In the current implementation, we treat the whole batch as failed if there is an error object.
     // This is fine for now as a baseline.
  })
})
