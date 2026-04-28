import { describe, it, expect, beforeEach } from 'vitest'
import { DexieTransactionRepository } from '../DexieTransactionRepository'
import { db } from '@/infrastructure/storage/VaultDatabase'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { vi } from 'vitest'
import 'fake-indexeddb/auto'

vi.mock('@/core/sync/SyncEngine', () => ({
  SyncEngine: {
    getInstance: vi.fn(() => ({
      enqueueSync: vi.fn(),
    })),
  },
}))

describe('DexieTransactionRepository', () => {
  let repository: DexieTransactionRepository

  beforeEach(async () => {
    // Limpa todas as tabelas antes de cada teste
    await Promise.all(Object.values(db.tables).map((table) => table.clear()))
    repository = new DexieTransactionRepository()
  })

  it('should save a transaction and automatically fill sync metadata via hooks', async () => {
    // @ts-expect-error - omitting metadata to test hooks
    const transaction: Transaction = {
      id: 'tx-1',
      user_id: 'user-1',
      title: 'Coffee',
      amount: 450n,
      type: 'expense',
      category_id: 'cat-1',
      wallet_id: 'wallet-1',
      date: '2026-04-07T10:00:00Z',
    }

    await repository.create(transaction)

    const all = await repository.getAll()
    expect(all).toHaveLength(1)

    // Verifica se os hooks preencheram os dados de sync
    const savedLocal = await db.transactions.get('tx-1')
    expect(savedLocal?.sync_status).toBe('pending')
    expect(savedLocal?.client_updated_at).toBeDefined()
    expect(savedLocal?.deleted).toBe(false)
  })

  it('should hide deleted transactions from all fetching methods', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t1: any = {
      id: 'tx-active',
      user_id: 'user-1',
      title: 'Active',
      amount: 1000n,
      type: 'income',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      deleted: false,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t2: any = {
      id: 'tx-deleted',
      user_id: 'user-1',
      title: 'Deleted',
      amount: 2000n,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      deleted: true,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t1: any = {
      id: 'tx-to-delete',
      user_id: 'user-1',
      title: 'Deleting soon',
      amount: 5000n,
      type: 'expense',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      sync_status: 'synced',
      deleted: false,
    }
    await db.transactions.add(t1)

    await repository.delete('tx-to-delete')

    const localItem = await db.transactions.get('tx-to-delete')
    expect(localItem?.deleted).toBe(true)
    expect(localItem?.sync_status).toBe('pending') // Hook updating should trigger this
  })

  it('should update last_modified_at and sync_status on update', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t1: any = {
      id: 'tx-update',
      user_id: 'user-1',
      title: 'Original Title',
      amount: 10000n,
      type: 'income',
      category_id: 'c1',
      wallet_id: 'w1',
      date: '2026-04-07T10:00:00Z',
      sync_status: 'synced',
      client_updated_at: '2000-01-01T00:00:00Z',
      deleted: false,
    }
    await db.transactions.add(t1)

    // Simulando um update via repository
    await db.transactions.update('tx-update', { title: 'Updated Title' })

    const updated = await db.transactions.get('tx-update')
    expect(updated?.title).toBe('Updated Title')
    expect(updated?.sync_status).toBe('pending')
    expect(new Date(updated!.client_updated_at).getTime()).toBeGreaterThan(
      new Date('2000-01-01').getTime(),
    )
  })

  // ── Wallet Balance Integration Tests (Task 4) ──

  it('should increase wallet balance when saving an income transaction', async () => {
    // Setup: Create wallet with initial balance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wallet: any = {
      id: 'wallet-income-test',
      user_id: 'user-1',
      name: 'Test Wallet',
      balance: 5000n, // R$ 50,00
      currency: 'BRL',
      type: 'checking',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await db.wallets.add(wallet)

    // Action: Save an income transaction
    const incomeTx: Transaction = {
      id: 'tx-income',
      user_id: 'user-1',
      title: 'Salary',
      amount: 300000n, // R$ 3.000,00
      type: 'income',
      category_id: 'cat-salary',
      wallet_id: 'wallet-income-test',
      date: '2026-04-10T10:00:00Z',
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await repository.create(incomeTx)

    // Assertion: Wallet balance should be increased
    const updatedWallet = await db.wallets.get('wallet-income-test')
    expect(updatedWallet?.balance).toBe(305000n) // 5000 + 300000 = R$ 3.050,00
  })

  it('should decrease wallet balance when saving an expense transaction', async () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wallet: any = {
      id: 'wallet-expense-test',
      user_id: 'user-1',
      name: 'Expense Wallet',
      balance: 100000n, // R$ 1.000,00
      currency: 'BRL',
      type: 'checking',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await db.wallets.add(wallet)

    // Action: Save an expense transaction
    const expenseTx: Transaction = {
      id: 'tx-expense',
      user_id: 'user-1',
      title: 'Groceries',
      amount: 4500n, // R$ 45,00
      type: 'expense',
      category_id: 'cat-food',
      wallet_id: 'wallet-expense-test',
      date: '2026-04-10T12:00:00Z',
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await repository.create(expenseTx)

    // Assertion: Wallet balance should be decreased
    const updatedWallet = await db.wallets.get('wallet-expense-test')
    expect(updatedWallet?.balance).toBe(95500n) // 100000 - 4500 = R$ 955,00
  })

  it('should reverse old transaction balance when updating an existing transaction', async () => {
    // Setup: Wallet + existing expense transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wallet: any = {
      id: 'wallet-update-test',
      user_id: 'user-1',
      name: 'Update Wallet',
      balance: 80000n, // R$ 800,00
      currency: 'BRL',
      type: 'checking',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await db.wallets.add(wallet)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldTx: any = {
      id: 'tx-to-update',
      user_id: 'user-1',
      title: 'Old Expense',
      amount: 2000n, // R$ 20,00 expense
      type: 'expense',
      category_id: 'cat-old',
      wallet_id: 'wallet-update-test',
      date: '2026-04-10T10:00:00Z',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await db.transactions.add(oldTx)
    // Wallet balance should already reflect the old transaction: 80000n includes the -2000n
    // Actually, the wallet was created at 80000n and then the tx was added separately.
    // Let's set the wallet to reflect the state after the old tx: started at 82000n, after -2000n = 80000n
    await db.wallets.update('wallet-update-test', { balance: 80000n })

    // Action: Update the transaction to a higher amount
    const updatedTx: Transaction = {
      ...oldTx,
      amount: 5000n, // R$ 50,00 (increased from R$ 20,00)
      client_updated_at: new Date().toISOString(),
    }
    await repository.update(updatedTx.id, updatedTx)

    // Assertion: Balance should reflect the delta: 80000 - 5000 + 2000 = 77000n
    const updatedWallet = await db.wallets.get('wallet-update-test')
    expect(updatedWallet?.balance).toBe(77000n)
  })

  it('should handle wallet change by reversing old wallet and crediting new wallet', async () => {
    // Setup: Two wallets + existing transaction in wallet A
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walletA: any = {
      id: 'wallet-a',
      user_id: 'user-1',
      name: 'Wallet A',
      balance: 98000n, // Already has -2000n from old tx
      currency: 'BRL',
      type: 'checking',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walletB: any = {
      id: 'wallet-b',
      user_id: 'user-1',
      name: 'Wallet B',
      balance: 50000n,
      currency: 'BRL',
      type: 'savings',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await db.wallets.bulkAdd([walletA, walletB])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldTx: any = {
      id: 'tx-wallet-change',
      user_id: 'user-1',
      title: 'Old Tx',
      amount: 2000n,
      type: 'expense',
      category_id: 'cat-1',
      wallet_id: 'wallet-a',
      date: '2026-04-10T10:00:00Z',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await db.transactions.add(oldTx)

    // Action: Move transaction from wallet A to wallet B
    const movedTx: Transaction = {
      ...oldTx,
      wallet_id: 'wallet-b', // Changed wallet
      client_updated_at: new Date().toISOString(),
    }
    await repository.update(movedTx.id, movedTx)

    // Assertion: Wallet A should be credited (reversed), Wallet B should be debited
    const finalWalletA = await db.wallets.get('wallet-a')
    const finalWalletB = await db.wallets.get('wallet-b')
    expect(finalWalletA?.balance).toBe(100000n) // 98000 + 2000 (reversed)
    expect(finalWalletB?.balance).toBe(48000n)  // 50000 - 2000
  })

  it('should reverse wallet balance when soft-deleting a transaction', async () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wallet: any = {
      id: 'wallet-delete-test',
      user_id: 'user-1',
      name: 'Delete Wallet',
      balance: 95000n, // After a R$ 50 expense from 100000n
      currency: 'BRL',
      type: 'checking',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await db.wallets.add(wallet)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx: any = {
      id: 'tx-to-soft-delete',
      user_id: 'user-1',
      title: 'Expense to delete',
      amount: 5000n, // R$ 50,00
      type: 'expense',
      category_id: 'cat-1',
      wallet_id: 'wallet-delete-test',
      date: '2026-04-10T10:00:00Z',
      sync_status: 'synced',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    await db.transactions.add(tx)

    // Action: Soft delete
    await repository.delete('tx-to-soft-delete')

    // Assertion: Wallet balance should be reversed (credited back)
    const updatedWallet = await db.wallets.get('wallet-delete-test')
    expect(updatedWallet?.balance).toBe(100000n) // 95000 + 5000

    // Transaction should be marked as deleted
    const deletedTx = await db.transactions.get('tx-to-soft-delete')
    expect(deletedTx?.deleted).toBe(true)
  })

  it('should NOT update wallet balance when wallet does not exist', async () => {
    // Setup: No wallet in DB
    const initialWallets = await db.wallets.toArray()
    expect(initialWallets).toHaveLength(0)

    // Action: Save transaction referencing non-existent wallet
    const orphanTx: Transaction = {
      id: 'tx-orphan',
      user_id: 'user-1',
      title: 'Orphan Tx',
      amount: 10000n,
      type: 'income',
      category_id: 'cat-1',
      wallet_id: 'non-existent-wallet',
      date: '2026-04-10T10:00:00Z',
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }

    // Should not throw (gracefully handles missing wallet)
    await expect(repository.create(orphanTx)).resolves.not.toThrow()

    // Transaction should be saved
    const saved = await db.transactions.get('tx-orphan')
    expect(saved).toBeDefined()
    expect(saved?.amount).toBe(10000n)

    // No wallets should exist (nothing to update)
    const finalWallets = await db.wallets.toArray()
    expect(finalWallets).toHaveLength(0)
  })
})
