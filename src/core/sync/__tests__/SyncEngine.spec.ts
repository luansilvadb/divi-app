import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SyncEngine } from '../SyncEngine'
import { vaultDb as db } from '@/infrastructure/storage/VaultDatabase'
import { supabase } from '../../supabase'
import { setActivePinia, createPinia } from 'pinia'
import 'fake-indexeddb/auto'

vi.mock('../../supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}))

vi.mock('@/infrastructure/crypto/VaultCryptoManager', () => ({
  VaultCryptoManager: {
    getInstance: vi.fn().mockReturnValue({
      hasKey: vi.fn().mockReturnValue(true),
      encrypt: vi.fn().mockImplementation((val) => Promise.resolve({ data: val, iv: 'mock-iv' })),
      decrypt: vi.fn().mockImplementation((payload) => Promise.resolve(payload.data)),
    })
  }
}))

const createMockTable = () => {
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
}

describe('SyncEngine (Local-First Engine Foundation)', () => {
  let engine: SyncEngine

  beforeEach(async () => {
    setActivePinia(createPinia())
    SyncEngine._resetInstance()

    // Clear all tables
    await Promise.all(Object.values(db.tables).map((table) => table.clear()))

    engine = SyncEngine.getInstance()
    vi.clearAllMocks()

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'],
      },
      error: null,
    } as unknown as Awaited<ReturnType<typeof supabase.auth.getUser>>)

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: { user: { id: 'test-user-id' } } as unknown as Awaited<
          ReturnType<typeof supabase.auth.getSession>
        >['data']['session'],
      },
      error: null,
    } as unknown as Awaited<ReturnType<typeof supabase.auth.getSession>>)
    // Default mock behavior
    vi.mocked(supabase.from).mockImplementation(
      () => createMockTable() as unknown as ReturnType<typeof supabase.from>,
    )

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
        created_at: now,
        deleted: false,
        version: 1,
      })

      const mockTable = createMockTable()
      vi.mocked(supabase.from).mockReturnValue(
        mockTable as unknown as ReturnType<typeof supabase.from>,
      )

      await engine.pushDirtyRecords()

      expect(supabase.from).toHaveBeenCalledWith('transactions')
      expect(mockTable.upsert).toHaveBeenCalled()

      const updated = await db.transactions.get('tx-1')
      expect(updated?.sync_status).toBe('synced')
    })

    it('should implement conflict resolution (LWW) when server version is newer', async () => {
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
        created_at: clientTime,
        deleted: false,
        version: 1,
      })

      // Simulate server having a newer version
      const mockTable = createMockTable()
      mockTable.maybeSingle.mockResolvedValue({
        data: { client_updated_at: serverTime, user_id: 'test-user-id', version: 2 },
        error: null,
      })
      mockTable.single.mockResolvedValue({
        data: {
          id: 'tx-conflict',
          user_id: 'test-user-id',
          title: 'Server Title',
          amount: 100,
          type: 'expense',
          category_id: 'cat-1',
          wallet_id: 'wal-1',
          date: serverTime,
          client_updated_at: serverTime,
          sync_status: 'synced',
          deleted: false,
          version: 2,
        },
        error: null,
      })
      vi.mocked(supabase.from).mockReturnValue(
        mockTable as unknown as ReturnType<typeof supabase.from>,
      )

      await engine.pushDirtyRecords()

      const local = await db.transactions.get('tx-conflict')
      expect(local?.title).toBe('Server Title')
      expect(local?.sync_status).toBe('synced')
    })

    it('should automatically set sync_status to pending on creation via Dexie hooks', async () => {
      // @ts-expect-error - explicitly omitting metadata to test hooks
      await db.transactions.add({
        id: 'tx-hook-test',
        user_id: 'test-user-id',
        title: 'Hook Test',
        amount: 50,
        type: 'expense',
        category_id: 'c1',
        wallet_id: 'w1',
        date: new Date().toISOString(),
      })

      const record = await db.transactions.get('tx-hook-test')
      expect(record?.sync_status).toBe('pending')
      expect(record?.client_updated_at).toBeDefined()
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
        created_at: new Date().toISOString(),
        deleted: false,
        version: 1,
      })

      await engine.pushDirtyRecords()

      expect(supabase.from).not.toHaveBeenCalled()
    })
  })

  describe('Immediate Sync (Enqueue)', () => {
    it('should trigger sync after a short delay when enqueueSync is called', async () => {
      vi.useFakeTimers()
      const triggerSpy = vi.spyOn(engine, 'trigger')

      engine.enqueueSync()

      expect(triggerSpy).not.toHaveBeenCalled()

      // Advance by debounce time (500ms)
      await vi.advanceTimersByTimeAsync(600)

      expect(triggerSpy).toHaveBeenCalled()
      vi.useRealTimers()
    })
  })
})
