import { describe, it, expect, beforeEach, vi } from 'vitest'
import { transactionservice } from './transactionservice'
import { BigIntAdapter } from '@/shared/utils/bigint-adapter'
import type { ITransactionRepository } from '@/modules/transactions/core/ports/ITransactionRepository'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import { useAuthStore } from '@/modules/auth/application/authStore'

// Mock do auth store
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'user-1' }
  }))
}))

describe('transactionservice', () => {
  let transactionservice: transactionservice
  let mockITransactionRepo: ITransactionRepository

  beforeEach(() => {
    mockITransactionRepo = {
      getAll: vi.fn(),
      getByMonth: vi.fn(),
      create: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      watchAll: vi.fn(),
      transferBetweenwallets: vi.fn().mockResolvedValue(undefined),
    }

    transactionservice = new transactionservice(mockITransactionRepo)
  })

  describe('BigInt conversion methods (via BigIntAdapter)', () => {
    it('should convert decimal to BigInt correctly (minor units)', () => {
      // Teste para certificar que os arredondamentos decimal -> bigint são infalíveis
      expect(BigIntAdapter.toMinorUnits(15.50)).toBe(1550n)
      expect(BigIntAdapter.toMinorUnits(15.5)).toBe(1550n)
      expect(BigIntAdapter.toMinorUnits(15.51)).toBe(1551n)
      expect(BigIntAdapter.toMinorUnits(0.99)).toBe(99n)
      expect(BigIntAdapter.toMinorUnits(1.00)).toBe(100n)
      expect(BigIntAdapter.toMinorUnits(100.00)).toBe(10000n)
      expect(BigIntAdapter.toMinorUnits(0.01)).toBe(1n)
      expect(BigIntAdapter.toMinorUnits(0.00)).toBe(0n)
      expect(BigIntAdapter.toMinorUnits(123.45)).toBe(12345n)
      expect(BigIntAdapter.toMinorUnits(1000.00)).toBe(100000n)
    })

    it('should handle string inputs correctly', () => {
      expect(BigIntAdapter.toMinorUnits('15.50')).toBe(1550n)
      expect(BigIntAdapter.toMinorUnits('15,50')).toBe(1550n)
      expect(BigIntAdapter.toMinorUnits('15')).toBe(1500n)
      expect(BigIntAdapter.toMinorUnits('0.99')).toBe(99n)
    })

    it('should handle edge cases', () => {
      expect(BigIntAdapter.toMinorUnits('')).toBe(0n)
      expect(BigIntAdapter.toMinorUnits(NaN)).toBe(0n)
      expect(BigIntAdapter.toMinorUnits('invalid')).toBe(0n)
    })

    it('should convert BigInt back to string correctly', () => {
      expect(BigIntAdapter.fromMinorUnits(1550n)).toBe('15,50')
      expect(BigIntAdapter.fromMinorUnits(100n)).toBe('1,00')
      expect(BigIntAdapter.fromMinorUnits(99n)).toBe('0,99')
      expect(BigIntAdapter.fromMinorUnits(0n)).toBe('0,00')
      expect(BigIntAdapter.fromMinorUnits(10000n)).toBe('100,00')
    })
  })

  describe('saveITransaction', () => {
    it('should save ITransaction with proper BigInt conversion', async () => {
      const mockAuthStore = useAuthStore() as any
      mockAuthStore.user = { id: 'user-1' }

      const createSpy = vi.spyOn(mockITransactionRepo, 'create')

      await transactionservice.saveITransaction({
        title: 'Test ITransaction',
        amount: '15.50', // String input
        type: 'income',
        category_id: 'cat-1',
        wallet_id: 'IWallet-1',
        date: '2026-04-13',
        notes: 'Test notes'
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        amount: 1550n, // Should be converted to BigInt (1550 cents)
        title: 'Test ITransaction',
        type: 'income',
        wallet_id: 'IWallet-1',
        user_id: 'user-1'
      }))
    })

    it('should handle numeric amount inputs', async () => {
      const mockAuthStore = useAuthStore() as any
      mockAuthStore.user = { id: 'user-1' }

      const createSpy = vi.spyOn(mockITransactionRepo, 'create')

      await transactionservice.saveITransaction({
        title: 'Test ITransaction',
        amount: 25.75, // Numeric input
        type: 'expense',
        category_id: 'cat-2',
        wallet_id: 'IWallet-2',
        date: '2026-04-13'
      })

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        amount: 2575n // Should be converted to BigInt (2575 cents)
      }))
    })

    it('should reject unauthenticated users', async () => {
      // Mock the auth store to return null user (unauthenticated)
      vi.mocked(useAuthStore).mockReturnValue({
        user: null,
        isAuthenticated: false,
      } as any)

      await expect(transactionservice.saveITransaction({
        title: 'Test ITransaction',
        amount: '15.50',
        type: 'income',
        category_id: 'cat-1',
        wallet_id: 'IWallet-1',
        date: '2026-04-13'
      })).rejects.toThrow('User not authenticated')
    })

    it('should handle ITransaction with all properties', async () => {
      const mockAuthStore = useAuthStore() as any
      mockAuthStore.user = { id: 'user-1' }

      // When an id is provided, saveITransaction calls update(), not create()
      const updateSpy = vi.spyOn(mockITransactionRepo, 'update')

      const ITransactionData = {
        id: 'tx-123',
        title: 'Salary Deposit',
        amount: '3000.00',
        type: 'income' as const,
        category_id: 'cat-salary',
        wallet_id: 'IWallet-main',
        date: '2026-04-13T10:00:00Z',
        notes: 'Monthly salary',
        tags: ['salary', 'monthly'],
        payee_id: 'payee-1'
      }

      await transactionservice.saveITransaction(ITransactionData)

      expect(updateSpy).toHaveBeenCalledWith(
        'tx-123',
        expect.objectContaining({
          title: 'Salary Deposit',
          amount: 300000n, // 3000.00 converted to cents
          type: 'income',
          category_id: 'cat-salary',
          wallet_id: 'IWallet-main',
          notes: 'Monthly salary',
          tags: ['salary', 'monthly'],
          payee_id: 'payee-1',
        })
      )

      // Verify that the amount was properly converted to BigInt
      expect(updateSpy).toHaveBeenCalledWith(
        'tx-123',
        expect.objectContaining({
          amount: 300000n,
          type: 'income'
        })
      )
    })
  })

  describe('loadMonthlytransactions', () => {
    it('should load transactions for specific month and year', async () => {
      const mocktransactions: ITransaction[] = [
        {
          id: 'tx-1',
          user_id: 'user-1',
          title: 'Test',
          amount: 1000n,
          type: 'income',
          category_id: 'cat-1',
          wallet_id: 'IWallet-1',
          date: '2026-04-01T00:00:00Z',
          sync_status: 'pending',
          created_at: '2026-04-01T00:00:00Z',
          client_updated_at: '2026-04-01T00:00:00Z',
          version: 1,
          deleted: false
        }
      ]

      vi.mocked(mockITransactionRepo.getByMonth).mockResolvedValue(mocktransactions)

      await transactionservice.loadMonthlytransactions(2026, 4)

      expect(mockITransactionRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })
  })
})
