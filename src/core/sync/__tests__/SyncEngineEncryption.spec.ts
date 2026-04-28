import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SyncEngine } from '../SyncEngine'
import { vaultDb as db } from '@/infrastructure/storage/VaultDatabase'
import { supabase } from '@/core/supabase'
import { VaultCryptoManager } from '@/infrastructure/crypto/VaultCryptoManager'
import 'fake-indexeddb/auto'

vi.mock('@/core/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}))

const createMockTable = () => {
  const mock = {
    upsert: vi.fn().mockResolvedValue({ error: null }),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }
  mock.select.mockReturnValue(mock)
  mock.eq.mockReturnValue(mock)
  return mock
}

describe('SyncEngine Encryption Integration', () => {
  let engine: SyncEngine
  const cryptoManager = VaultCryptoManager.getInstance()

  beforeEach(async () => {
    SyncEngine._resetInstance()
    await Promise.all(Object.values(db.tables).map((table) => table.clear()))
    engine = SyncEngine.getInstance()
    vi.clearAllMocks()

    // Initialize crypto manager with test password
    await cryptoManager.initialize('test-vault-password')

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'test-user-id' } as any },
      error: null,
    } as any)

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: 'test-user-id' } } as any },
      error: null,
    } as any)

    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
  })

  it('should push encrypted payload to Supabase', async () => {
    const now = new Date().toISOString()
    const record = {
      id: 'tx-1',
      user_id: 'test-user-id',
      title: 'Secret Coffee',
      amount: 45n,
      type: 'expense' as const,
      category_id: 'cat-1',
      wallet_id: 'wal-1',
      date: now,
      sync_status: 'pending' as const,
      client_updated_at: now,
      created_at: now,
      deleted: false,
      version: 1,
    }
    
    await db.transactions.add(record)

    const mockTable = createMockTable()
    vi.mocked(supabase.from).mockReturnValue(mockTable as any)

    await engine.pushDirtyRecords()

    expect(mockTable.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'tx-1',
        user_id: 'test-user-id',
        encrypted_payload: expect.any(Object),
      }),
      expect.any(Object)
    )

    // Verify sensitive fields are NOT in the top level
    const callArgs = mockTable.upsert.mock.calls[0]![0]
    expect(callArgs.title).toBeUndefined()
    expect(callArgs.amount).toBeUndefined()
  })

  it('should decrypt payload when pulling from Supabase', async () => {
    const now = new Date().toISOString()
    const plainData = { title: 'Decrypted Coffee', amount: 15.0 }
    const encrypted = await cryptoManager.encrypt(JSON.stringify(plainData))

    const mockTable = createMockTable()
    mockTable.select.mockReturnThis()
    mockTable.maybeSingle.mockResolvedValue({
        data: null, // No conflict
        error: null
    })
    
    // Simulate server data
    vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'transactions') {
            return {
                select: () => ({
                    eq: () => Promise.resolve({
                        data: [{
                            id: 'tx-server',
                            user_id: 'test-user-id',
                            encrypted_payload: encrypted,
                            client_updated_at: now,
                            server_updated_at: now,
                            version: 1,
                            deleted: false
                        }],
                        error: null
                    })
                })
            } as any
        }
        return createMockTable() as any
    })

    await engine.pullFromServer()

    const localRecord = await db.transactions.get('tx-server')
    expect(localRecord).toBeDefined()
    expect(localRecord?.title).toBe('Decrypted Coffee')
    expect(localRecord?.amount).toBe(15.0)
  })
})
