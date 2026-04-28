import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usetransactionstore } from '../transactionstore'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import { formatMessage } from '@/shared/messages/catalog'

// Mocking dependencies
const mockITransactionRepo = {
  create: vi.fn().mockImplementation((t) => Promise.resolve({ ...t, id: t.id || 'new-id' })),
  update: vi.fn().mockImplementation((id, t) => Promise.resolve({ ...t, id })),
  delete: vi.fn(),
  getByMonth: vi.fn().mockResolvedValue([]),
  getAll: vi.fn().mockResolvedValue([]),
}

const mockIWalletRepo = {
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

describe('transactionstore CRUD', () => {
  const sampleTx: ITransaction = {
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
    mockITransactionRepo.getByMonth.mockResolvedValue([])
    mockITransactionRepo.getAll.mockResolvedValue([])
    mockActivityLogService.getRecentActivities.mockResolvedValue([])

    // Register mocks in the container
    container.register(DI_TOKENS.ITransactionRepository, mockITransactionRepo)
    container.register(DI_TOKENS.IWalletRepository, mockIWalletRepo)
    container.register(DI_TOKENS.ICategoryRepository, mockCategoryRepo)
    container.register(DI_TOKENS.IActivityLogService, mockActivityLogService)
  })

  describe('Read Operations', () => {
    it('should fetch transactions and update state', async () => {
      const mockTxs = [sampleTx]
      mockITransactionRepo.getByMonth.mockResolvedValue(mockTxs)

      const store = usetransactionstore()
      await store.fetchtransactionsByMonth(2026, 4)

      expect(mockITransactionRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
      expect(store.transactions).toEqual(mockTxs)
    })

    it('should handle repository errors gracefully during fetch', async () => {
      mockITransactionRepo.getByMonth.mockRejectedValue(new Error('DB Error'))

      const store = usetransactionstore()
      await expect(store.fetchtransactionsByMonth(2026, 4)).rejects.toThrow('DB Error')
    })
  })

  describe('Create/Update Operations', () => {
    it('should call create/update on repository and refresh list', async () => {
      const store = usetransactionstore()
      mockITransactionRepo.getByMonth.mockResolvedValue([])

      await store.saveITransaction(sampleTx)

      // It's an update because sampleTx has an ID and we setup initial state
      // Wait, in this test it checks 'isUpdate' based on if it's in the list.
      // But store.transactions is empty. So it calls create.
      expect(mockITransactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: sampleTx.id,
          title: sampleTx.title,
          sync_status: 'pending',
        }),
      )
      expect(mockITransactionRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })
  })

  describe('Delete Operations', () => {
    it('should perform optimistic delete and then persist', async () => {
      const store = usetransactionstore()
      store.transactions = [sampleTx]

      await store.deleteITransaction(sampleTx.id)

      expect(store.transactions[0]?.deleted).toBe(true)
      expect(mockITransactionRepo.delete).toHaveBeenCalledWith(sampleTx.id)
    })

    it('should rollback optimistic delete on failure', async () => {
      const store = usetransactionstore()
      store.transactions = [sampleTx]

      mockITransactionRepo.delete.mockRejectedValue(new Error('Delete Failed'))
      mockITransactionRepo.getByMonth.mockResolvedValue([sampleTx])

      await expect(store.deleteITransaction(sampleTx.id)).rejects.toThrow('Delete Failed')

      expect(mockITransactionRepo.getByMonth).toHaveBeenCalled()
    })
  })

  describe('Validation and Optimistic Updates', () => {
    it('should validate ITransaction before saving', async () => {
      const invalidTx = { ...sampleTx, amount: -1000n }
      const store = usetransactionstore()

      await expect(store.saveITransaction(invalidTx)).rejects.toThrow()
    })

    it('should support updating an existing ITransaction in the list and handle refresh', async () => {
      const store = usetransactionstore()
      store.transactions = [{ ...sampleTx }]

      const updatedTx = { ...sampleTx, title: 'New Title' }
      mockITransactionRepo.getByMonth.mockResolvedValue([updatedTx])

      await store.saveITransaction(updatedTx)

      const found = store.transactions.find((t) => t.id === sampleTx.id)
      expect(found?.title).toBe('New Title')
    })

    it('should assign current user_id when saving a new ITransaction', async () => {
      const store = usetransactionstore()
      const txWithoutUser = { ...sampleTx, user_id: '' }

      await store.saveITransaction(txWithoutUser)

      expect(mockITransactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'test-user-id',
        }),
      )
    })
  })

  describe('Audit Logging', () => {
    it('should create an audit log entry when saving a ITransaction', async () => {
      const store = usetransactionstore()
      await store.saveITransaction(sampleTx)

      expect(mockActivityLogService.logActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.any(String),
          description: formatMessage('MSG_ACT_TX_DESC', { amount: '10,00', title: 'Sample' }),
          user_id: 'test-user-id',
        }),
      )
    })

    it('should create an audit log entry when deleting a ITransaction', async () => {
      const store = usetransactionstore()
      store.transactions = [sampleTx]

      await store.deleteITransaction(sampleTx.id)

      expect(mockActivityLogService.logActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.stringMatching(/Delete|Removida|Remoção/i),
          user_id: 'test-user-id',
        }),
      )
    })
  })
})
