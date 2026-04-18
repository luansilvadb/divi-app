import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTransactionStore } from '../transactionStore'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { Transaction } from '@/shared/domain/entities/Transaction'

// Mocking dependencies
const mockTransactionRepo = {
  save: vi.fn(),
  delete: vi.fn(),
  getByMonth: vi.fn().mockResolvedValue([]),
  getAll: vi.fn().mockResolvedValue([]),
}

const mockWalletRepo = {
  getAll: vi.fn().mockResolvedValue([]),
}

const mockCategoryRepo = {
  getAll: vi.fn().mockResolvedValue([]),
}

const mockActivityLogService = {
  logActivity: vi.fn(),
  getRecentActivities: vi.fn().mockResolvedValue([]),
}

// We mock the SyncStore as it's used in a watch
vi.mock('@/core/sync/syncStore', () => ({
  useSyncStore: () => ({
    updateCounter: 0,
  }),
}))

// Mock AuthStore
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-id' },
  }),
}))

describe('TransactionStore CRUD', () => {
  const sampleTx: Transaction = {
    id: 'tx-1',
    title: 'Sample',
    amount: 1000n,
    type: 'expense',
    date: '2026-04-10T00:00:00Z',
    category_id: 'cat-1',
    wallet_id: 'wal-1',
    user_id: 'user-1',
    sync_status: 'synced',
    deleted: false,
    client_updated_at: '2026-04-10T00:00:00Z',
    created_at: '2026-04-10T00:00:00Z',
    version: 1,
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()

    // Devolvemos o comportamento default após o reset
    mockTransactionRepo.getByMonth.mockResolvedValue([])
    mockTransactionRepo.getAll.mockResolvedValue([])
    mockActivityLogService.getRecentActivities.mockResolvedValue([])

    // Register mocks in the container
    container.register(DI_TOKENS.TransactionRepository, mockTransactionRepo)
    container.register(DI_TOKENS.WalletRepository, mockWalletRepo)
    container.register(DI_TOKENS.CategoryRepository, mockCategoryRepo)
    container.register(DI_TOKENS.ActivityLogService, mockActivityLogService)
  })

  describe('Read Operations', () => {
    it('should fetch transactions and update state', async () => {
      const mockTxs = [sampleTx]
      mockTransactionRepo.getByMonth.mockResolvedValue(mockTxs)

      const store = useTransactionStore()
      await store.fetchTransactionsByMonth(2026, 4)

      expect(mockTransactionRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
      expect(store.transactions).toEqual(mockTxs)
    })

    it('should handle repository errors gracefully during fetch', async () => {
      mockTransactionRepo.getByMonth.mockRejectedValue(new Error('DB Error'))

      const store = useTransactionStore()
      await expect(store.fetchTransactionsByMonth(2026, 4)).rejects.toThrow('DB Error')
    })
  })

  describe('Create/Update Operations', () => {
    it('should call save on repository and refresh list', async () => {
      const store = useTransactionStore()
      mockTransactionRepo.getByMonth.mockResolvedValue([])

      await store.saveTransaction(sampleTx)

      expect(mockTransactionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: sampleTx.id,
          title: sampleTx.title,
          sync_status: 'pending',
        }),
      )
      expect(mockTransactionRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })
  })

  describe('Delete Operations', () => {
    it('should perform optimistic delete and then persist', async () => {
      const store = useTransactionStore()
      store.transactions = [sampleTx]

      await store.deleteTransaction(sampleTx.id)

      expect(store.transactions[0]?.deleted).toBe(true)
      expect(mockTransactionRepo.delete).toHaveBeenCalledWith(sampleTx.id)
    })

    it('should rollback optimistic delete on failure', async () => {
      const store = useTransactionStore()
      store.transactions = [sampleTx]

      mockTransactionRepo.delete.mockRejectedValue(new Error('Delete Failed'))
      mockTransactionRepo.getByMonth.mockResolvedValue([sampleTx])

      await expect(store.deleteTransaction(sampleTx.id)).rejects.toThrow('Delete Failed')

      expect(mockTransactionRepo.getByMonth).toHaveBeenCalled()
    })
  })

  describe('Validation and Optimistic Updates', () => {
    it('should validate transaction before saving', async () => {
      const invalidTx = { ...sampleTx, amount: -1000n }
      const store = useTransactionStore()

      await expect(store.saveTransaction(invalidTx)).rejects.toThrow('Amount must be positive')
    })

    it('should support updating an existing transaction in the list and handle refresh', async () => {
      const store = useTransactionStore()
      store.transactions = [{ ...sampleTx }]

      const updatedTx = { ...sampleTx, title: 'New Title' }
      mockTransactionRepo.getByMonth.mockResolvedValue([updatedTx])

      await store.saveTransaction(updatedTx)

      const found = store.transactions.find((t) => t.id === sampleTx.id)
      expect(found?.title).toBe('New Title')
    })

    it('should assign current user_id when saving a new transaction', async () => {
      const store = useTransactionStore()
      const txWithoutUser = { ...sampleTx, user_id: '' }

      await store.saveTransaction(txWithoutUser)

      expect(mockTransactionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'test-user-id',
        }),
      )
    })
  })

  describe('Audit Logging', () => {
    it('should create an audit log entry when saving a transaction', async () => {
      const store = useTransactionStore()
      await store.saveTransaction(sampleTx)

      expect(mockActivityLogService.logActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.stringMatching(/Transaction|Transação/i),
          description: expect.stringMatching(/R\$ 10,00 : Sample/),
          user_id: 'test-user-id',
        }),
      )
    })

    it('should create an audit log entry when deleting a transaction', async () => {
      const store = useTransactionStore()
      store.transactions = [sampleTx]

      await store.deleteTransaction(sampleTx.id)

      expect(mockActivityLogService.logActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.stringMatching(/Delete|Removida|Remoção/i),
          user_id: 'test-user-id',
        }),
      )
    })
  })
})
