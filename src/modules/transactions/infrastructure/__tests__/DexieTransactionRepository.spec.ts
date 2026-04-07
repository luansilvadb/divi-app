import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DexieTransactionRepository } from '../DexieTransactionRepository'
import { DiviDatabase } from '../../../../infrastructure/db/DexieDB'
import Dexie from 'dexie'
import { indexedDB, IDBKeyRange } from 'fake-indexeddb'
import type { Transaction } from '../../domain/Transaction'

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange

describe('DexieTransactionRepository', () => {
  let db: DiviDatabase
  let repository: DexieTransactionRepository

  beforeEach(() => {
    db = new DiviDatabase('TestRepoDB')
    repository = new DexieTransactionRepository(db)
  })

  afterEach(async () => {
    await db.delete()
  })

  it('should save a transaction and retrieve it', async () => {
    const transaction: Transaction = {
      id: '018ebb00-0000-7000-8000-000000000001',
      user_id: 'user-1',
      title: 'Coffee',
      amount: 4.5,
      type: 'expense',
      category_id: 'cat-1',
      wallet_id: 'wallet-1',
      date: '2026-04-07T10:00:00Z',
      deleted: false,
      created_at: '2026-04-07T10:00:00Z',
      updated_at: '2026-04-07T10:00:00Z'
    }

    await repository.save(transaction)

    const all = await repository.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(transaction.id)
    expect(all[0].title).toBe('Coffee')
  })

  it('should handle multiple transactions', async () => {
    const t1: Transaction = {
      id: '018ebb00-0000-7000-8000-000000000001',
      user_id: 'user-1',
      title: 'T1',
      amount: 10,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      deleted: false,
      created_at: '2026-04-07T10:00:00Z',
      updated_at: '2026-04-07T10:00:00Z'
    }
    const t2: Transaction = {
      id: '018ebb00-0000-7000-8000-000000000002',
      user_id: 'user-1',
      title: 'T2',
      amount: 20,
      type: 'income',
      category_id: 'c2',
      wallet_id: 'w2',
      date: '2026-04-07T11:00:00Z',
      deleted: false,
      created_at: '2026-04-07T11:00:00Z',
      updated_at: '2026-04-07T11:00:00Z'
    }

    await repository.save(t1)
    await repository.save(t2)

    const all = await repository.getAll()
    expect(all).toHaveLength(2)
  })

  it('should return a live query observable from watchAll', async () => {
    const observable = repository.watchAll()
    expect(observable).toBeDefined()
    expect(typeof observable.subscribe).toBe('function')
  })
})
