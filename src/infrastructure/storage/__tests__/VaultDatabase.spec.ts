import { describe, it, expect, beforeEach } from 'vitest'
import { VaultDatabase } from '../VaultDatabase'

describe('VaultDatabase Hooks', () => {
  let db: VaultDatabase

  beforeEach(async () => {
    // Use an in-memory or unique name for testing to avoid polluting real data
    db = new VaultDatabase()
    await db.clearAllData()
  })

  it('deve inicializar a versão como 1 ao criar um novo registro', async () => {
    const ITransaction = {
      id: 'test-1',
      user_id: 'user-1',
      title: 'Teste',
      amount: BigInt(100),
      type: 'expense' as const,
      category_id: 'cat-1',
      wallet_id: 'wall-1',
      date: new Date().toISOString(),
      sync_status: 'pending' as const,
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      deleted: false,
    }

    // @ts-ignore - version is handled by hooks
    await db.transactions.add(ITransaction)
    
    const saved = await db.transactions.get('test-1')
    expect(saved?.version).toBe(1)
    expect(saved?.sync_status).toBe('pending')
    expect(saved?.deleted).toBe(false)
  })

  it('deve incrementar a versão ao atualizar um registro', async () => {
    const ITransaction = {
      id: 'test-2',
      user_id: 'user-1',
      title: 'Teste Original',
      amount: BigInt(100),
      type: 'expense' as const,
      category_id: 'cat-1',
      wallet_id: 'wall-1',
      date: new Date().toISOString(),
      version: 1,
      sync_status: 'pending' as const,
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      deleted: false,
    }

    await db.transactions.add(ITransaction)
    
    // Simular atualização de negócio (sem mexer no sync_status)
    await db.transactions.update('test-2', { title: 'Teste Atualizado' })
    
    const updated = await db.transactions.get('test-2')
    expect(updated?.version).toBe(2)
    expect(updated?.sync_status).toBe('pending')
  })

  it('NÃO deve incrementar a versão se o sync_status for fornecido pelo SyncEngine', async () => {
    const ITransaction = {
      id: 'test-3',
      user_id: 'user-1',
      title: 'Teste',
      amount: BigInt(100),
      type: 'expense' as const,
      category_id: 'cat-1',
      wallet_id: 'wall-1',
      date: new Date().toISOString(),
      version: 5,
      sync_status: 'pending' as const,
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      deleted: false,
    }

    await db.transactions.add(ITransaction)
    
    // Simular o SyncEngine marcando como sincronizado
    await db.transactions.update('test-3', { 
      sync_status: 'synced',
      last_synced_at: new Date().toISOString()
    })
    
    const synced = await db.transactions.get('test-3')
    expect(synced?.version).toBe(5) // Deve permanecer 5
    expect(synced?.sync_status).toBe('synced')
  })
})
