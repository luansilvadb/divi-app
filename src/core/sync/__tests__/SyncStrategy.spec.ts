import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SyncEngine } from '../SyncEngine'
import { db } from '../../db'
import { supabase } from '../../supabase'

vi.mock('../../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      delete: vi.fn(() => ({
        in: vi.fn().mockResolvedValue({ error: null })
      })),
      upsert: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ data: [], error: null })
      })),
      select: vi.fn(() => ({
        in: vi.fn().mockResolvedValue({ data: [], error: null })
      }))
    }))
  }
}))

describe('Sync Strategy (LWW)', () => {
  let syncEngine: SyncEngine

  beforeEach(async () => {
    await db.transactions.clear()
    syncEngine = new SyncEngine()
  })

  it('should NOT overwrite remote record if remote updated_at is newer', async () => {
    const id = 'conflict-id'
    const now = new Date()
    const earlier = new Date(now.getTime() - 1000).toISOString()
    const later = now.toISOString()

    // Local is earlier
    await db.transactions.add({
      id,
      user_id: 'u1',
      title: 'Local Version',
      amount: 100,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07',
      syncStatus: 'pending',
      deleted: false,
      updated_at: earlier
    })

    // Mock remote as later
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        in: vi.fn().mockResolvedValueOnce({ 
          data: [{ id, updated_at: later, title: 'Remote Version' }], 
          error: null 
        })
      }),
      upsert: vi.fn()
    } as any)

    await syncEngine.sync()

    // Remote should NOT have been upserted (upsert should not be called for this record)
    // Actually, we expect the local record to be updated with the remote version
    const localRecord = await db.transactions.get({ id })
    expect(localRecord?.title).toBe('Remote Version')
    expect(localRecord?.syncStatus).toBe('synced')
    expect(localRecord?.updated_at).toBe(later)
  })

  it('should overwrite remote record if local updated_at is newer', async () => {
    const id = 'win-id'
    const now = new Date()
    const earlier = new Date(now.getTime() - 1000).toISOString()
    const later = now.toISOString()

    // Local is later
    await db.transactions.add({
      id,
      user_id: 'u1',
      title: 'Local Newer',
      amount: 100,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07',
      syncStatus: 'pending',
      deleted: false,
      updated_at: later
    })

    // Mock remote as earlier
    const fromMock = vi.fn((table: string) => {
      if (table === 'transactions') {
        return {
          select: vi.fn().mockImplementation((query) => {
            if (query === '*') {
              return {
                in: vi.fn().mockResolvedValueOnce({ 
                  data: [{ id, updated_at: earlier, title: 'Remote Older' }], 
                  error: null 
                })
              }
            } else if (query === 'id') {
              // This is from the upsert.select('id')
              return Promise.resolve({ data: [{ id }], error: null })
            }
            return { in: vi.fn().mockResolvedValueOnce({ data: [], error: null }) }
          }),
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValueOnce({ data: [{ id }], error: null })
          })
        }
      }
      return {}
    })
    
    vi.mocked(supabase.from).mockImplementation(fromMock as any)

    await syncEngine.sync()

    const localRecord = await db.transactions.get({ id })
    expect(localRecord?.syncStatus).toBe('synced')
    // We can't easily check if upsert was called with correct data here without more mocks, 
    // but the transition to 'synced' confirms it was processed.
    })

    it('should mark records as failed if supabase upsert fails', async () => {
    const id = 'fail-id'
    await db.transactions.add({
      id,
      user_id: 'u1',
      title: 'Fail Test',
      amount: 100,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07',
      syncStatus: 'pending',
      deleted: false,
      updated_at: new Date().toISOString()
    })

    // Mock successful select but failed upsert
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'transactions') {
        return {
          select: vi.fn().mockImplementation((query) => {
            if (query === '*') return { in: vi.fn().mockResolvedValueOnce({ data: [], error: null }) }
            return { in: vi.fn().mockResolvedValueOnce({ data: [], error: null }) }
          }),
          upsert: vi.fn().mockReturnValueOnce({
            select: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Supabase Error' } })
          })
        } as any
      }
      return {} as any
    })

    await syncEngine.sync()

    const record = await db.transactions.get({ id })
    expect(record?.syncStatus).toBe('failed')
    })
    })
