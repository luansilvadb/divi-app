import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SyncEngine } from '../SyncEngine'
import { db } from '../../db'
import { supabase } from '../../supabase'
import { setActivePinia, createPinia } from 'pinia'
import 'fake-indexeddb/auto'

vi.mock('../../supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      upsert: vi.fn(),
      delete: vi.fn(),
      select: vi.fn(),
      eq: vi.fn(),
      in: vi.fn(),
    })),
  },
}))

describe('SyncEngine Error Handling', () => {
  let engine: SyncEngine

  beforeEach(async () => {
    setActivePinia(createPinia())
    SyncEngine._resetInstance()
    await Promise.all(
      Object.values(db.tables).map(table => table.clear())
    )
    engine = SyncEngine.getInstance()
    vi.clearAllMocks()
    vi.mocked(supabase.auth.getUser).mockResolvedValue({ 
      data: { user: { id: 'u1' } }, 
      error: null 
    } as any)
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
  })

  it('should mark records as "failed" if Supabase returns an error', async () => {
    const id = 'error-123'
    const now = new Date().toISOString()
    await db.transactions.add({
      id,
      user_id: 'u1',
      title: 'Error Test',
      amount: 100,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: now,
      sync_status: 'pending',
      client_updated_at: now,
      deleted: false,
      version: 1
    })

    vi.mocked(supabase.from).mockReturnValue({
      upsert: vi.fn().mockResolvedValue({ 
        error: { message: 'Network Timeout', code: 'TIMEOUT' } 
      })
    } as any)

    await engine.pushDirtyRecords()

    const record = await db.transactions.get(id)
    expect(record?.sync_status).toBe('failed')
  })
})
