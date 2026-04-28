import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TransactionService } from '../TransactionService'
import type { ITransactionRepository } from '@/modules/transactions/core/ports/ITransactionRepository'
import type { IAuthService } from '@/modules/auth/core/ports/IAuthService'

describe('TransactionService', () => {
  let transactionService: TransactionService
  let mockITransactionRepo: ITransactionRepository
  let mockAuthService: IAuthService

  beforeEach(() => {
    mockITransactionRepo = {
      getAll: vi.fn(),
      getByMonth: vi.fn(),
      create: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      watchAll: vi.fn(),
      transferBetweenwallets: vi.fn(),
    }

    mockAuthService = {
      getCurrentUser: vi.fn().mockResolvedValue({ id: 'user-1' }),
      login: vi.fn(),
      logout: vi.fn(),
      onAuthStateChange: vi.fn(),
    } as any

    transactionService = new TransactionService(mockITransactionRepo, mockAuthService)
  })

  describe('BigInt conversion', () => {
    it('should convert amount to minor units', async () => {
      const createSpy = vi.spyOn(mockITransactionRepo, 'create')

      await transactionService.saveITransaction({
        title: 'Test',
        amount: '15.50',
        type: 'income',
        category_id: 'cat-1',
        wallet_id: 'wallet-1',
        date: '2026-04-13'
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        amount: 1550n,
      }))
    })
  })

  describe('saveITransaction', () => {
    it('should reject unauthenticated users', async () => {
      vi.mocked(mockAuthService.getCurrentUser).mockResolvedValue(null)

      await expect(transactionService.saveITransaction({
        title: 'Test',
        amount: '15.50',
        type: 'income',
        category_id: 'cat-1',
        wallet_id: 'wallet-1',
        date: '2026-04-13'
      })).rejects.toThrow()
    })
  })
})
