import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { VaultTransactionRepository } from '../VaultTransactionRepository'
import { db } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

// Mock Dexie database
vi.mock('@/infrastructure/storage/VaultDatabase', () => ({
  db: {
    transaction: vi.fn(),
    transactions: {
      put: vi.fn(),
      get: vi.fn(),
      filter: vi.fn().mockReturnThis(),
      toArray: vi.fn(),
      where: vi.fn().mockReturnThis(),
      between: vi.fn().mockReturnThis(),
      and: vi.fn().mockReturnThis(),
    },
    wallets: {
      get: vi.fn(),
      put: vi.fn(),
    },
  },
}))

// Mock SyncEngine
vi.mock('@/core/sync/SyncEngine', () => ({
  SyncEngine: {
    getInstance: vi.fn().mockReturnValue({
      enqueueSync: vi.fn(),
    }),
  },
}))

describe('VaultTransactionRepository', () => {
  let repository: VaultTransactionRepository

  beforeEach(() => {
    repository = new VaultTransactionRepository()
    vi.clearAllMocks()
  })

  describe('transferBetweenWallets', () => {
    it('should execute transfer between wallets successfully', async () => {
      // Mock wallet data
      const fromWallet = { id: 'wallet1', balance: '10000', user_id: 'user1', name: 'Wallet 1' }
      const toWallet = { id: 'wallet2', balance: '5000', user_id: 'user2', name: 'Wallet 2' }

      // Mock database calls
      ;(db.wallets.get as any).mockResolvedValueOnce(fromWallet)
      ;(db.wallets.get as any).mockResolvedValueOnce(toWallet)
      ;(db.transactions.put as any).mockResolvedValueOnce(undefined)
      ;(db.transactions.put as any).mockResolvedValueOnce(undefined)
      ;(db.wallets.put as any).mockResolvedValueOnce(undefined)
      ;(db.wallets.put as any).mockResolvedValueOnce(undefined)

      // Mock transaction call - Dexie signature: transaction(mode, ...tables, callback)
      ;(db.transaction as any).mockImplementation(async (...args: any[]) => {
        // Last argument is the callback function
        const callback = args[args.length - 1]
        if (typeof callback === 'function') {
          await callback()
        }
      })

      // Execute transfer
      await repository.transferBetweenWallets(
        'wallet1',
        'wallet2',
        1000n,
        'Transferência tática',
        new Date('2026-04-13'),
      )

      // Verify calls
      expect(db.transaction).toHaveBeenCalledWith(
        'rw',
        db.transactions,
        db.wallets,
        expect.any(Function),
      )
      expect(db.wallets.get).toHaveBeenCalledTimes(2)
      expect(db.wallets.get).toHaveBeenCalledWith('wallet1')
      expect(db.wallets.get).toHaveBeenCalledWith('wallet2')
      expect(db.transactions.put).toHaveBeenCalledTimes(2)
      expect(db.wallets.put).toHaveBeenCalledTimes(2)
      expect(SyncEngine.getInstance().enqueueSync).toHaveBeenCalled()
    })

    it('should throw error when from wallet not found', async () => {
      ;(db.wallets.get as any).mockResolvedValueOnce(null)

      // Error is wrapped in InfrastructureError
      await expect(repository.transferBetweenWallets('wallet1', 'wallet2', 1000n)).rejects.toThrow(
        'Failed to execute transfer between wallets',
      )
    })

    it('should throw error when to wallet not found', async () => {
      const fromWallet = { id: 'wallet1', balance: '10000', user_id: 'user1', name: 'Wallet 1' }
      ;(db.wallets.get as any).mockResolvedValueOnce(fromWallet)
      ;(db.wallets.get as any).mockResolvedValueOnce(null)

      // Error is wrapped in InfrastructureError
      await expect(repository.transferBetweenWallets('wallet1', 'wallet2', 1000n)).rejects.toThrow(
        'Failed to execute transfer between wallets',
      )
    })

    it('should throw error when insufficient balance', async () => {
      const fromWallet = { id: 'wallet1', balance: '500', user_id: 'user1', name: 'Wallet 1' }
      const toWallet = { id: 'wallet2', balance: '5000', user_id: 'user2', name: 'Wallet 2' }
      ;(db.wallets.get as any).mockResolvedValueOnce(fromWallet)
      ;(db.wallets.get as any).mockResolvedValueOnce(toWallet)

      // Error is wrapped in InfrastructureError
      await expect(repository.transferBetweenWallets('wallet1', 'wallet2', 1000n)).rejects.toThrow(
        'Failed to execute transfer between wallets',
      )
    })
  })
})
