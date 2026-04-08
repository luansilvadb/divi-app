import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SyncEngine } from '../SyncEngine'
import { db } from '../../db'
import { supabase } from '../../supabase'
import { setActivePinia, createPinia } from 'pinia'
import 'fake-indexeddb/auto'

// Mock do Supabase extremamente resiliente
vi.mock('../../supabase', () => {
  const mockUpsert = vi.fn().mockResolvedValue({ error: null })
  const mockDelete = vi.fn().mockReturnThis()
  const mockIn = vi.fn().mockResolvedValue({ error: null })
  const mockSelect = vi.fn().mockReturnThis()
  const mockEq = vi.fn().mockResolvedValue({ data: [], error: null })

  return {
    supabase: {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } }, error: null }),
      },
      from: vi.fn(() => ({
        upsert: mockUpsert,
        delete: mockDelete,
        in: mockIn,
        select: mockSelect,
        eq: mockEq,
      })),
    },
  }
})

describe('SyncEngine (Motor de Sincronização)', () => {
  let engine: SyncEngine

  beforeEach(async () => {
    setActivePinia(createPinia())
    // Reseta o Singleton para cada teste
    SyncEngine._resetInstance()
    
    await db.transactions.clear()
    await db.wallets.clear()
    await db.categories.clear()
    
    engine = SyncEngine.getInstance()
    vi.clearAllMocks()
    
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
  })

  afterEach(async () => {
    await db.transactions.clear()
  })

  it('deve identificar e subir apenas registros marcados como "dirty"', async () => {
    const now = new Date().toISOString()
    await db.transactions.add({ 
        id: '1', 
        title: 'Dirty Item', 
        amount: 100, 
        is_dirty: 1, 
        syncStatus: 'pending', 
        type: 'expense', 
        category_id: 'c1', 
        wallet_id: 'w1', 
        date: now, 
        deleted: false, 
        user_id: 'test-user-id',
        last_modified_at: now,
        updated_at: now
    })

    const fromMock = vi.mocked(supabase.from)
    const upsertSpy = vi.fn().mockResolvedValue({ error: null })
    fromMock.mockReturnValue({ upsert: upsertSpy } as any)

    await engine.pushDirtyRecords()

    expect(fromMock).toHaveBeenCalledWith('transactions')
    expect(upsertSpy).toHaveBeenCalled()
    
    const payload = upsertSpy.mock.calls[0]?.[0] as any[]
    expect(payload?.[0]?.id).toBe('1')
    expect(payload?.[0]?.is_dirty).toBeUndefined()

    const updated = await db.transactions.where('id').equals('1').first()
    expect(updated?.is_dirty).toBe(0)
  })

  it('deve remover itens do Dexie após Hard-Delete bem-sucedido no Supabase', async () => {
    const now = new Date().toISOString()
    const mockId = 'del-999'
    await db.transactions.add({ 
      id: mockId, 
      title: 'Item Deletado', 
      is_dirty: 1, 
      deleted: true,
      amount: 0,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: now,
      user_id: 'u1',
      syncStatus: 'pending',
      last_modified_at: now,
      updated_at: now
    })

    const fromMock = vi.mocked(supabase.from)
    const deleteMock = vi.fn().mockReturnThis()
    const inMock = vi.fn().mockResolvedValue({ error: null })
    fromMock.mockReturnValue({ delete: deleteMock, in: inMock } as any)

    await engine.pushDirtyRecords()

    expect(inMock).toHaveBeenCalledWith('id', [mockId])
    const check = await db.transactions.where('id').equals(mockId).first()
    expect(check).toBeUndefined()
  })

  it('não deve rodar se estiver offline', async () => {
    const now = new Date().toISOString()
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
    
    await db.transactions.add({ 
      id: 'off', 
      title: 'Wait', 
      is_dirty: 1,
      amount: 0,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: now,
      user_id: 'u1',
      syncStatus: 'pending',
      last_modified_at: now,
      updated_at: now,
      deleted: false
    })
    
    const fromMock = vi.mocked(supabase.from)
    await engine.pushDirtyRecords()
    expect(fromMock).not.toHaveBeenCalled()
  })

  it('deve converter strings vazias em null para evitar erros de sintaxe UUID', async () => {
    const now = new Date().toISOString()
    await db.transactions.add({ 
        id: 'bad-uuid', 
        title: 'Error-Prone', 
        is_dirty: 1, 
        category_id: '', 
        wallet_id: 'w1',
        amount: 0,
        type: 'expense',
        date: now,
        user_id: 'u1',
        syncStatus: 'pending',
        last_modified_at: now,
        updated_at: now,
        deleted: false
    })

    const fromMock = vi.mocked(supabase.from)
    const upsertSpy = vi.fn().mockResolvedValue({ error: null })
    fromMock.mockReturnValue({ upsert: upsertSpy } as any)

    await engine.pushDirtyRecords()

    const sentData = upsertSpy.mock.calls[0]?.[0] as any[]
    expect(sentData?.[0]?.category_id).toBeNull()
  })

  it('deve remover registros locais se eles sumirem do Supabase (Reconciliação)', async () => {
    const now = new Date().toISOString()
    // 1. Registro que já estava sincronizado (is_dirty: 0)
    await db.transactions.add({ 
        id: 'orphan-1', 
        title: 'Fantasma', 
        is_dirty: 0, 
        syncStatus: 'synced',
        amount: 0, 
        type: 'expense', 
        category_id: 'c1', 
        wallet_id: 'w1', 
        date: now, 
        deleted: false, 
        user_id: 'test-user-id',
        last_modified_at: now,
        updated_at: now
    })

    const fromMock = vi.mocked(supabase.from)
    // Mock simula que o Supabase está VAZIO (retorna select: id => [])
    fromMock.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null })
      })
    } as any)

    await engine.pullFromServer()

    // O registro deve ter sido limpo pelo Detector de Fantasmas
    const check = await db.transactions.where('id').equals('orphan-1').first()
    expect(check).toBeUndefined()
  })
})
