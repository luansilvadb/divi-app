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
    from: vi.fn(() => {
      const mock = {
        upsert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      mock.select.mockReturnValue(mock)
      mock.eq.mockReturnValue(mock)
      mock.in.mockReturnValue(mock)
      return mock
    }),
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
      data: {
        user: {
          id: 'u1',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        }
      },
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
      created_at: now,
      deleted: false,
      version: 1
    })

    const mockTable = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      upsert: vi.fn().mockResolvedValue({ 
        error: { message: 'Network Timeout', code: 'TIMEOUT' } 
      })
    }
    vi.mocked(supabase.from).mockReturnValue(mockTable as unknown as ReturnType<typeof supabase.from>)

    await engine.pushDirtyRecords()

    const record = await db.transactions.get(id)
    expect(record?.sync_status).toBe('failed')
  })
})

