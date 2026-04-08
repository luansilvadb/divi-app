import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SyncEngine } from '../SyncEngine'
import { db } from '../../db'
import { supabase } from '../../supabase'

vi.mock('../../supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

describe('SyncEngine Task Implementation: Validate Response', () => {
  let syncEngine: SyncEngine

  beforeEach(async () => {
    await Promise.all([
      db.transactions.clear(),
      db.wallets.clear()
    ])
    syncEngine = new SyncEngine()
    vi.clearAllMocks()
  })

  it('should update local record with remote id and set status to synced for NEW records', async () => {
    // 1. Add record locally without an ID
    const localId = await db.transactions.add({
      user_id: 'u1',
      title: 'New Sync Test',
      amount: 100,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07',
      syncStatus: 'pending',
      deleted: false,
      updated_at: new Date().toISOString()
    })

    const remoteId = 'generated-uuid-from-server'

    // Mock supabase behavior
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'transactions') {
        return {
          select: vi.fn().mockImplementation((query) => {
            if (query === '*') {
              return { in: vi.fn().mockResolvedValueOnce({ data: [], error: null }) }
            }
            return { in: vi.fn().mockResolvedValueOnce({ data: [], error: null }) }
          }),
          upsert: vi.fn().mockImplementation((payload) => ({
            select: vi.fn().mockResolvedValueOnce({ 
              data: payload.map((p: any) => ({ id: p.id })), 
              error: null 
            })
          }))
        } as any
      }
      return {} as any
    })

    // 2. Run sync
    await syncEngine.sync()

    // 3. Verify local record is updated
    const record = await db.transactions.get(localId)
    
    expect(record?.id).toBeDefined()
    expect(typeof record?.id).toBe('string')
    expect(record?.syncStatus).toBe('synced')
  })
})
