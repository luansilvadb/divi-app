import { describe, it, expect, beforeEach, vi } from 'vitest'
import { transactionservice } from '../../application/services/transactionservice'
import { ITransactionValidator } from '../../application/services/ITransactionValidator'
import { AutoCategorizationService } from '../../application/services/AutoCategorizationService'
import { ExportService } from '../../application/services/ExportService'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'
import type { ITransactionRepository } from '@/modules/transactions/core/ports/ITransactionRepository'
import { of } from 'rxjs'
import { ValidationError } from '@/core/errors'

// Mock authStore
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-123' },
  }),
}))

describe('transactionservice - CRUD', () => {
  let service: transactionservice
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
    service = new transactionservice(mockRepo)
  })

  describe('Create', () => {
    it('should create ITransaction with correct data', async () => {
      const data = {
        title: 'Test ITransaction',
        amount: 150.75,
        type: 'expense' as const,
        category_id: 'cat-1',
        wallet_id: 'IWallet-1',
        date: '2026-04-15',
      }

      await service.saveITransaction(data)

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test ITransaction',
          amount: 15075n,
          type: 'expense',
          user_id: 'test-user-123',
        })
      )
    })

    it('should update existing ITransaction when id provided', async () => {
      const data = {
        id: 'tx-123',
        title: 'Updated',
        amount: 200,
        type: 'expense' as const,
        category_id: 'cat-1',
        wallet_id: 'IWallet-1',
        date: '2026-04-10',
      }

      await service.saveITransaction(data)

      expect(mockRepo.update).toHaveBeenCalledWith(
        'tx-123',
        expect.objectContaining({ title: 'Updated' })
      )
    })
  })

  describe('Read', () => {
    it('should load monthly transactions', async () => {
      await service.loadMonthlytransactions(2026, 4)
      expect(mockRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })

    it('should emit transactions through observable', async () => {
      const mockList = [{ id: '1', title: 'T1' }] as ITransaction[]
      vi.mocked(mockRepo.getByMonth).mockResolvedValue(mockList)

      let received: ITransaction[] = []
      service.transactions$.subscribe((val: ITransaction[]) => (received = val))

      await service.loadMonthlytransactions(2026, 4)

      expect(received).toEqual(mockList)
    })
  })

  describe('Delete', () => {
    it('should delete ITransaction and reload month', async () => {
      await service.deleteITransaction('tx-1', 2026, 4)

      expect(mockRepo.delete).toHaveBeenCalledWith('tx-1')
      expect(mockRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })
  })
})

describe('ITransactionValidator', () => {
  let validator: ITransactionValidator

  beforeEach(() => {
    validator = new ITransactionValidator()
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

  it('should validate ITransaction type', () => {
    expect(() =>
      validator.validate('ITransactionType', {
        field: 'type',
        value: 'income',
        params: {},
      })
    ).not.toThrow()

    expect(() =>
      validator.validate('ITransactionType', {
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
    const categories: ICategory[] = [
      { id: 'cat-1', name: 'Entertainment', color: '#ff0000', icon: 'movie' },
    ]

    const result = service.suggestCategory('Netflix subscription', categories)

    expect(result?.name).toBe('Entertainment')
  })

  it('should return null for unknown keywords', () => {
    const categories: ICategory[] = [
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

  it('should format ITransaction in CSV', () => {
    const transactions: ITransaction[] = [
      {
        id: 'tx-1',
        title: 'Test',
        amount: 1000n,
        type: 'expense',
        category_id: 'cat-1',
        wallet_id: 'IWallet-1',
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
