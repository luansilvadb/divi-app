import { describe, it, expect, vi, beforeEach } from 'vitest'
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

describe('SyncEngine (Local-First Engine Foundation)', () => {
  let engine: SyncEngine

  beforeEach(async () => {
    setActivePinia(createPinia())
    SyncEngine._resetInstance()
    
    // Clear all tables
    await Promise.all(
      Object.values(db.tables).map(table => table.clear())
    )
    
    engine = SyncEngine.getInstance()
    vi.clearAllMocks()
    
    vi.mocked(supabase.auth.getUser).mockResolvedValue({ 
      data: { user: { id: 'test-user-id' } }, 
      error: null 
    } as any)
    
    // Simulate online
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
  })

  describe('Push Changes', () => {
    it('should push pending changes to Supabase and update status to synced', async () => {
      const now = new Date().toISOString()
      await db.transactions.add({
        id: 'tx-1',
        user_id: 'test-user-id',
        title: 'New Transaction',
        amount: 100,
        type: 'expense',
        category_id: 'cat-1',
        wallet_id: 'wal-1',
        date: now,
        sync_status: 'pending',
        client_updated_at: now,
        deleted: false,
        version: 1
      })

      const upsertSpy = vi.fn().mockResolvedValue({ error: null })
      vi.mocked(supabase.from).mockReturnValue({ upsert: upsertSpy } as any)

      await engine.pushDirtyRecords()

      expect(supabase.from).toHaveBeenCalledWith('transactions')
      expect(upsertSpy).toHaveBeenCalled()
      
      const updated = await db.transactions.get('tx-1')
      expect(updated?.sync_status).toBe('synced')
    })

    it('should implement conflict resolution (LWW) when server version is newer', async () => {
      // This test will fail because LWW is not implemented yet
      const clientTime = '2026-01-01T10:00:00Z'
      const serverTime = '2026-01-01T11:00:00Z'
      
      await db.transactions.add({
        id: 'tx-conflict',
        user_id: 'test-user-id',
        title: 'Client Title',
        amount: 100,
        type: 'expense',
        category_id: 'cat-1',
        wallet_id: 'wal-1',
        date: clientTime,
        sync_status: 'pending',
        client_updated_at: clientTime,
        deleted: false,
        version: 1
      })

      // Simulate server having a newer version
      const selectSpy = vi.fn().mockReturnThis()
      const eqSpy = vi.fn().mockResolvedValue({ 
        data: [{ 
          id: 'tx-conflict', 
          title: 'Server Title', 
          client_updated_at: serverTime,
          sync_status: 'synced' 
        }], 
        error: null 
      })
      vi.mocked(supabase.from).mockReturnValue({ select: selectSpy, eq: eqSpy } as any)

      await engine.pushDirtyRecords()

      // Expect the local record to be updated from server since server is newer (LWW)
      const local = await db.transactions.get('tx-conflict')
      expect(local?.title).toBe('Server Title')
      expect(local?.sync_status).toBe('synced')
    })
  })

  describe('Online/Offline Transitions', () => {
    it('should not attempt to push when offline', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
      
      await db.transactions.add({
        id: 'tx-offline',
        user_id: 'test-user-id',
        title: 'Offline Tx',
        amount: 10,
        type: 'expense',
        category_id: 'c1',
        wallet_id: 'w1',
        date: new Date().toISOString(),
        sync_status: 'pending',
        client_updated_at: new Date().toISOString(),
        deleted: false,
        version: 1
      })

      await engine.pushDirtyRecords()

      expect(supabase.from).not.toHaveBeenCalled()
    })
  })
})
