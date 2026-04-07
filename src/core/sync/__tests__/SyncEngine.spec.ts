import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SyncEngine } from '../SyncEngine'
import { db } from '../../db'

describe('SyncEngine', () => {
  let syncEngine: SyncEngine

  beforeEach(async () => {
    // Clear all tables
    await Promise.all([
      db.transactions.clear(),
      db.wallets.clear(),
      db.categories.clear(),
      db.payees.clear(),
      db.loans.clear(),
      db.subscriptions.clear()
    ])
    syncEngine = new SyncEngine()
  })

  it('should find all pending records across monitored tables', async () => {
    // Add pending transaction
    await db.transactions.add({
      user_id: 'u1',
      title: 'T1',
      amount: 10,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07',
      syncStatus: 'pending',
      deleted: false,
      updated_at: new Date().toISOString()
    })

    // Add synced transaction (should be ignored)
    await db.transactions.add({
      user_id: 'u1',
      title: 'T2',
      amount: 20,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07',
      syncStatus: 'synced',
      deleted: false,
      updated_at: new Date().toISOString()
    })

    // Add pending wallet
    await db.wallets.add({
      user_id: 'u1',
      name: 'W1',
      balance: 100,
      currency: 'BRL',
      syncStatus: 'pending'
    })

    const pendingRecords = await syncEngine.getPendingRecords()

    // 1 transaction + 1 wallet = 2 records
    expect(pendingRecords).toHaveLength(2)
    
    const transactionRecord = pendingRecords.find(r => r.table === 'transactions')
    expect(transactionRecord).toBeDefined()
    expect(transactionRecord?.data.title).toBe('T1')

    const walletRecord = pendingRecords.find(r => r.table === 'wallets')
    expect(walletRecord).toBeDefined()
    expect(walletRecord?.data.name).toBe('W1')
  })

  it('should find failed records as well', async () => {
    await db.categories.add({
      name: 'C1',
      syncStatus: 'failed'
    })

    const pendingRecords = await syncEngine.getPendingRecords()
    expect(pendingRecords).toHaveLength(1)
    expect(pendingRecords[0].table).toBe('categories')
    expect(pendingRecords[0].data.syncStatus).toBe('failed')
  })
})
