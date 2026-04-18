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

describe('SyncEngine Lamport Logic', () => {
  let engine: SyncEngine

  beforeEach(async () => {
    setActivePinia(createPinia())
    SyncEngine._resetInstance()

    await db.clearAllData()

    engine = SyncEngine.getInstance()
    vi.clearAllMocks()

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    } as any)

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: 'test-user-id' } } },
      error: null,
    } as any)

    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
  })

  it('deve PULL quando server.version > client.version', async () => {
    await db.transactions.add({
      id: 'tx-v-conflict',
      user_id: 'test-user-id',
      title: 'Cliente v1',
      amount: BigInt(100),
      type: 'expense' as const,
      category_id: 'c1',
      wallet_id: 'w1',
      date: new Date().toISOString(),
      sync_status: 'pending',
      version: 1,
      client_updated_at: '2026-01-01T10:00:00Z'
    })

    // Server has newer version (5 > 1) but older timestamp (09:00 < 10:00)
    // Version should win -> PULL
    const mockTable = createMockTable()
    mockTable.maybeSingle.mockResolvedValue({
      data: { version: 5, client_updated_at: '2026-01-01T09:00:00Z', user_id: 'test-user-id' },
      error: null,
    })
    mockTable.single.mockResolvedValue({
      data: {
        id: 'tx-v-conflict',
        user_id: 'test-user-id',
        title: 'Server v5',
        amount: BigInt(500),
        type: 'expense',
        version: 5,
        client_updated_at: '2026-01-01T09:00:00Z'
      },
      error: null,
    })
    vi.mocked(supabase.from).mockReturnValue(mockTable as any)

    await engine.pushDirtyRecords()

    const local = await db.transactions.get('tx-v-conflict')
    expect(local?.title).toBe('Server v5')
    expect(local?.version).toBe(5)
  })

  it('deve PUSH quando client.version > server.version', async () => {
    await db.transactions.add({
      id: 'tx-client-v2',
      user_id: 'test-user-id',
      title: 'Cliente v2',
      amount: BigInt(200),
      type: 'expense' as const,
      category_id: 'c1',
      wallet_id: 'w1',
      date: new Date().toISOString(),
      sync_status: 'pending',
      version: 2,
      client_updated_at: '2026-01-01T12:00:00Z'
    })

    // Client has newer version (2 > 1) but older timestamp (09:00 < 10:00)
    // Version should win -> PUSH
    const mockTable = createMockTable()
    mockTable.maybeSingle.mockResolvedValue({
      data: { version: 1, client_updated_at: '2026-01-01T10:00:00Z', user_id: 'test-user-id' },
      error: null,
    })
    vi.mocked(supabase.from).mockReturnValue(mockTable as any)

    await engine.pushDirtyRecords()

    expect(mockTable.upsert).toHaveBeenCalled()
    const local = await db.transactions.get('tx-client-v2')
    expect(local?.sync_status).toBe('synced')
  })

  it('deve usar LWW (timestamp) como tie-breaker quando as versões são iguais', async () => {
    const olderTime = '2026-01-01T10:00:00Z'
    const newerTime = '2026-01-01T11:00:00Z'

    await db.transactions.add({
      id: 'tx-tie',
      user_id: 'test-user-id',
      title: 'Cliente Antigo',
      amount: BigInt(100),
      type: 'expense' as const,
      category_id: 'c1',
      wallet_id: 'w1',
      date: olderTime,
      sync_status: 'pending',
      version: 3,
      client_updated_at: olderTime
    })

    const mockTable = createMockTable()
    mockTable.maybeSingle.mockResolvedValue({
      data: { version: 3, client_updated_at: newerTime, user_id: 'test-user-id' },
      error: null,
    })
    mockTable.single.mockResolvedValue({
      data: {
        id: 'tx-tie',
        user_id: 'test-user-id',
        title: 'Server Novo',
        amount: BigInt(500),
        version: 3,
        client_updated_at: newerTime
      },
      error: null,
    })
    vi.mocked(supabase.from).mockReturnValue(mockTable as any)

    await engine.pushDirtyRecords()

    const local = await db.transactions.get('tx-tie')
    expect(local?.title).toBe('Server Novo')
  })
})
