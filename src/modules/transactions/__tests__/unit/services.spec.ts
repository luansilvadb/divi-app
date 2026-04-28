import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TransactionService } from '../../application/services/TransactionService'
import { TransactionValidator } from '../../application/services/TransactionValidator'
import { AutoCategorizationService } from '../../application/services/AutoCategorizationService'
import { ExportService } from '../../application/services/ExportService'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import { of } from 'rxjs'
import { ValidationError } from '@/core/errors'

// Mock authStore
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-123' },
  }),
}))

describe('TransactionService - CRUD', () => {
  let service: TransactionService
  let mockRepo: ITransactionRepository

  beforeEach(() => {
    mockRepo = {
      getAll: vi.fn(),
      getByMonth: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({} as any),
      update: vi.fn().mockResolvedValue({} as any),
      delete: vi.fn().mockResolvedValue(undefined),
      watchAll: vi.fn().mockReturnValue(of([])),
    }
    service = new TransactionService(mockRepo)
  })

  describe('Create', () => {
    it('should create transaction with correct data', async () => {
      const data = {
        title: 'Test Transaction',
        amount: 150.75,
        type: 'expense' as const,
        category_id: 'cat-1',
        wallet_id: 'wallet-1',
        date: '2026-04-15',
      }

      await service.saveTransaction(data)

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Transaction',
          amount: 15075n,
          type: 'expense',
          user_id: 'test-user-123',
        })
      )
    })

    it('should update existing transaction when id provided', async () => {
      const data = {
        id: 'tx-123',
        title: 'Updated',
        amount: 200,
        type: 'expense' as const,
        category_id: 'cat-1',
        wallet_id: 'wallet-1',
        date: '2026-04-10',
      }

      await service.saveTransaction(data)

      expect(mockRepo.update).toHaveBeenCalledWith(
        'tx-123',
        expect.objectContaining({ title: 'Updated' })
      )
    })
  })

  describe('Read', () => {
    it('should load monthly transactions', async () => {
      await service.loadMonthlyTransactions(2026, 4)
      expect(mockRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })

    it('should emit transactions through observable', async () => {
      const mockList = [{ id: '1', title: 'T1' }] as Transaction[]
      vi.mocked(mockRepo.getByMonth).mockResolvedValue(mockList)

      let received: Transaction[] = []
      service.transactions$.subscribe((val: Transaction[]) => (received = val))

      await service.loadMonthlyTransactions(2026, 4)

      expect(received).toEqual(mockList)
    })
  })

  describe('Delete', () => {
    it('should delete transaction and reload month', async () => {
      await service.deleteTransaction('tx-1', 2026, 4)

      expect(mockRepo.delete).toHaveBeenCalledWith('tx-1')
      expect(mockRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })
  })
})

describe('TransactionValidator', () => {
  let validator: TransactionValidator

  beforeEach(() => {
    validator = new TransactionValidator()
  })

  it('should validate required fields', () => {
    expect(() =>
      validator.validate('required', {
        field: 'title',
        value: 'Valid',
        params: {},
      })
    ).not.toThrow()

    expect(() =>
      validator.validate('required', {
        field: 'title',
        value: '',
        params: {},
      })
    ).toThrow(ValidationError)
  })

  it('should validate transaction type', () => {
    expect(() =>
      validator.validate('transactionType', {
        field: 'type',
        value: 'income',
        params: {},
      })
    ).not.toThrow()

    expect(() =>
      validator.validate('transactionType', {
        field: 'type',
        value: 'invalid',
        params: {},
      })
    ).toThrow(ValidationError)
  })

  it('should validate positive amount', () => {
    expect(() =>
      validator.validate('positiveAmount', {
        field: 'amount',
        value: 100,
        params: {},
      })
    ).not.toThrow()

    expect(() =>
      validator.validate('positiveAmount', {
        field: 'amount',
        value: -10,
        params: {},
      })
    ).toThrow(ValidationError)
  })
})

describe('AutoCategorizationService', () => {
  let service: AutoCategorizationService

  beforeEach(() => {
    service = new AutoCategorizationService()
  })

  it('should suggest category by keyword', () => {
    const categories: Category[] = [
      { id: 'cat-1', name: 'Entertainment', color: '#ff0000', icon: 'movie' },
    ]

    const result = service.suggestCategory('Netflix subscription', categories)

    expect(result?.name).toBe('Entertainment')
  })

  it('should return null for unknown keywords', () => {
    const categories: Category[] = [
      { id: 'cat-1', name: 'Entertainment', color: '#ff0000', icon: 'movie' },
    ]

    const result = service.suggestCategory('Random purchase', categories)

    expect(result).toBeNull()
  })
})

describe('ExportService', () => {
  let service: ExportService

  beforeEach(() => {
    service = new ExportService()
  })

  it('should generate CSV with headers', () => {
    const csv = service.generateCSV([])
    expect(csv).toContain('Data,Título,Valor,Tipo,Categoria,Carteira,Notas')
  })

  it('should format transaction in CSV', () => {
    const transactions: Transaction[] = [
      {
        id: 'tx-1',
        title: 'Test',
        amount: 1000n,
        type: 'expense',
        category_id: 'cat-1',
        wallet_id: 'wallet-1',
        date: '2026-04-15',
        user_id: 'user-1',
        tags: [],
        sync_status: 'synced',
        created_at: '2026-04-15T00:00:00Z',
        client_updated_at: '2026-04-15T00:00:00Z',
        version: 1,
        deleted: false,
      },
    ]

    const csv = service.generateCSV(transactions)

    expect(csv).toContain('Test')
    expect(csv).toContain('1000')
    expect(csv).toContain('expense')
  })
})
