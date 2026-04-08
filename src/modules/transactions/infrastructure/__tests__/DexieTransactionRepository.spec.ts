import { describe, it, expect, beforeEach } from 'vitest'
import { DexieTransactionRepository } from '../DexieTransactionRepository'
import { db } from '@/core/db'
import type { Transaction } from '@/shared/domain/entities/Transaction'

describe('DexieTransactionRepository', () => {
  let repository: DexieTransactionRepository

  beforeEach(async () => {
    await db.transactions.clear()
    repository = new DexieTransactionRepository()
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
      syncStatus: 'pending',
      deleted: false,
      created_at: '2026-04-07T10:00:00Z',
      updated_at: '2026-04-07T10:00:00Z'
    }

    await repository.save(transaction)

    const all = await repository.getAll()
    expect(all).toHaveLength(1)
    expect(all[0]!.id).toBe(transaction.id)
    expect(all[0]!.title).toBe('Coffee')
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
      syncStatus: 'pending',
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
      syncStatus: 'pending',
      deleted: false,
      created_at: '2026-04-07T11:00:00Z',
      updated_at: '2026-04-07T11:00:00Z'
    }

    await repository.save(t1)
    await repository.save(t2)

    const all = await repository.getAll()
    expect(all).toHaveLength(2)
  })
})
