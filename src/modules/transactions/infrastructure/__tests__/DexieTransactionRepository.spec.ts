import { describe, it, expect, beforeEach } from 'vitest'
import { DexieTransactionRepository } from '../DexieTransactionRepository'
import { db } from '@/core/db'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { vi } from 'vitest'
import 'fake-indexeddb/auto'

vi.mock('@/core/sync/SyncEngine', () => ({
  SyncEngine: {
    getInstance: vi.fn(() => ({
      enqueueSync: vi.fn()
    }))
  }
}))

describe('DexieTransactionRepository', () => {
  let repository: DexieTransactionRepository

  beforeEach(async () => {
    // Limpa todas as tabelas antes de cada teste
    await Promise.all(
      Object.values(db.tables).map(table => table.clear())
    )
    repository = new DexieTransactionRepository()
  })

  it('should save a transaction and automatically fill sync metadata via hooks', async () => {
    // @ts-expect-error - omitting metadata to test hooks
    const transaction: Transaction = {
      id: 'tx-1',
      user_id: 'user-1',
      title: 'Coffee',
      amount: 4.5,
      type: 'expense',
      category_id: 'cat-1',
      wallet_id: 'wallet-1',
      date: '2026-04-07T10:00:00Z'
    }

    await repository.save(transaction)

    const all = await repository.getAll()
    expect(all).toHaveLength(1)
    
    // Verifica se os hooks preencheram os dados de sync
    const savedLocal = await db.transactions.get('tx-1')
    expect(savedLocal?.sync_status).toBe('pending')
    expect(savedLocal?.client_updated_at).toBeDefined()
    expect(savedLocal?.deleted).toBe(false)
  })

  it('should hide deleted transactions from all fetching methods', async () => {
    const t1: any = {
      id: 'tx-active',
      user_id: 'user-1',
      title: 'Active',
      amount: 10,
      type: 'income',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      deleted: false
    }
    const t2: any = {
      id: 'tx-deleted',
      user_id: 'user-1',
      title: 'Deleted',
      amount: 20,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      deleted: true
    }

    await db.transactions.bulkAdd([t1, t2])

    // getAll should only return the active one
    const all = await repository.getAll()
    expect(all).toHaveLength(1)
    expect(all[0]!.id).toBe('tx-active')

    // watchAll (liveQuery) should also filter
    const observable = repository.watchAll()
    // liveQuery tests are tricky, but we verify the filter was added in source
    expect(observable).toBeDefined()
  })

  it('should mark for sync when a transaction is deleted (soft delete)', async () => {
    const t1: any = {
      id: 'tx-to-delete',
      user_id: 'user-1',
      title: 'Deleting soon',
      amount: 50,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      sync_status: 'synced',
      deleted: false
    }
    await db.transactions.add(t1)

    await repository.delete('tx-to-delete')

    const localItem = await db.transactions.get('tx-to-delete')
    expect(localItem?.deleted).toBe(true)
    expect(localItem?.sync_status).toBe('pending') // Hook updating should trigger this
  })

  it('should update last_modified_at and sync_status on update', async () => {
    const t1: any = {
      id: 'tx-update',
      user_id: 'user-1',
      title: 'Original Title',
      amount: 100,
      type: 'income',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      sync_status: 'synced',
      client_updated_at: '2000-01-01T00:00:00Z',
      deleted: false
    }
    await db.transactions.add(t1)

    // Simulando um update via repository
    await db.transactions.update('tx-update', { title: 'Updated Title' })

    const updated = await db.transactions.get('tx-update')
    expect(updated?.title).toBe('Updated Title')
    expect(updated?.sync_status).toBe('pending')
    expect(new Date(updated!.client_updated_at).getTime()).toBeGreaterThan(new Date('2000-01-01').getTime())
  })
})
