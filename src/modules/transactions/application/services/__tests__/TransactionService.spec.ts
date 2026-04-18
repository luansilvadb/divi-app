import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TransactionService } from '../TransactionService'
import { BigIntAdapter } from '@/shared/utils/bigint-adapter'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import { of } from 'rxjs'

// Mock do authStore
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-123' },
  }),
}))

describe('TransactionService', () => {
  let service: TransactionService
  let mockRepo: ITransactionRepository

  beforeEach(() => {
    mockRepo = {
      getAll: vi.fn(),
      getByMonth: vi.fn().mockResolvedValue([]),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      watchAll: vi.fn().mockReturnValue(of([])),
    }
    service = new TransactionService(mockRepo)
  })

  describe('BigInt Handling (Minor Units)', () => {
    it('should correctly convert decimal number to minor units bigint', () => {
      expect(BigIntAdapter.toMinorUnits(15.5)).toBe(1550n)
      expect(BigIntAdapter.toMinorUnits(10)).toBe(1000n)
      expect(BigIntAdapter.toMinorUnits(0.01)).toBe(1n)
    })

    it('should correctly convert decimal string to minor units bigint', () => {
      expect(BigIntAdapter.toMinorUnits('15.50')).toBe(1550n)
      expect(BigIntAdapter.toMinorUnits('15,50')).toBe(1550n) // Suporte a vírgula pt-BR
    })

    it('should correctly format minor units bigint to decimal string', () => {
      expect(BigIntAdapter.fromMinorUnits(1550n)).toBe('15,50')
      expect(BigIntAdapter.fromMinorUnits(1000n)).toBe('10,00')
    })

    // ── Edge Cases: Arredondamentos infalíveis (Task 4) ──

    it('should handle zero correctly', () => {
      expect(BigIntAdapter.toMinorUnits(0)).toBe(0n)
      expect(BigIntAdapter.toMinorUnits('0')).toBe(0n)
      expect(BigIntAdapter.toMinorUnits('0,00')).toBe(0n)
    })

    it('should handle very small values without precision loss', () => {
      expect(BigIntAdapter.toMinorUnits(0.001)).toBe(0n)    // Rounds down
      expect(BigIntAdapter.toMinorUnits(0.005)).toBe(1n)    // Rounds up (0.5 cents)
      expect(BigIntAdapter.toMinorUnits(0.009)).toBe(1n)    // Rounds up
      expect(BigIntAdapter.toMinorUnits('0,01')).toBe(1n)   // Minimum cent
    })

    it('should handle large values without IEEE 754 precision loss', () => {
      // IEEE 754 loses precision at large numbers; BigInt must be exact
      expect(BigIntAdapter.toMinorUnits(1000000)).toBe(100000000n)  // R$ 1.000.000,00
      expect(BigIntAdapter.toMinorUnits(9999999.99)).toBe(999999999n)
      expect(BigIntAdapter.toMinorUnits('12345678,90')).toBe(1234567890n)
    })

    it('should handle IEEE 754 problematic values correctly', () => {
      // Classic floating point traps
      expect(BigIntAdapter.toMinorUnits(0.1 + 0.2)).toBe(30n)    // 0.3 → 30 cents (not 30.000000000000004)
      expect(BigIntAdapter.toMinorUnits(0.07 * 100)).toBe(700n)  // 7.00 → 700 cents
      expect(BigIntAdapter.toMinorUnits(19.99)).toBe(1999n)       // Common price
      expect(BigIntAdapter.toMinorUnits(0.29)).toBe(29n)
    })

    it('should handle negative values correctly', () => {
      expect(BigIntAdapter.toMinorUnits(-15.5)).toBe(-1550n)
      expect(BigIntAdapter.toMinorUnits('-10,50')).toBe(-1050n)
      expect(BigIntAdapter.toMinorUnits(-0.01)).toBe(-1n)
    })

    it('should handle NaN input gracefully', () => {
      expect(BigIntAdapter.toMinorUnits(NaN)).toBe(0n)
      expect(BigIntAdapter.toMinorUnits('abc')).toBe(0n)
      expect(BigIntAdapter.toMinorUnits('')).toBe(0n)
    })

    it('should handle bigint passthrough correctly', () => {
      // toMinorUnits accepts number|string, but internally handles edge cases
      // Verify that the conversion path is safe for all valid inputs
      expect(BigIntAdapter.toMinorUnits('100')).toBe(10000n)
      expect(BigIntAdapter.toMinorUnits(100)).toBe(10000n)
    })

    it('should format negative bigint to decimal string correctly', () => {
      expect(BigIntAdapter.fromMinorUnits(-1550n)).toBe('-15,50')
      expect(BigIntAdapter.fromMinorUnits(-1n)).toBe('-0,01')
    })

    it('should format zero with two decimal places', () => {
      expect(BigIntAdapter.fromMinorUnits(0n)).toBe('0,00')
    })

    it('should format large values with pt-BR locale', () => {
      expect(BigIntAdapter.fromMinorUnits(100000000n)).toBe('1.000.000,00')
      expect(BigIntAdapter.fromMinorUnits(1234567890n)).toBe('12.345.678,90')
    })
  })

  describe('Save/Delete Operations', () => {
    it('should convert amount to bigint and call repo save', async () => {
      const data = {
        title: 'Lunch',
        amount: 15.5,
        type: 'expense' as const,
        category_id: 'cat-1',
        wallet_id: 'wallet-1',
        date: '2026-04-07',
      }

      await service.saveTransaction(data)

      expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Lunch',
        amount: 1550n,
        user_id: 'test-user-123',
      }))
    })

    it('should reload monthly transactions after save', async () => {
      const data = {
        title: 'Lunch',
        amount: 10,
        type: 'expense' as const,
        category_id: 'cat-1',
        wallet_id: 'wallet-1',
        date: '2026-04-07',
      }

      await service.saveTransaction(data)

      expect(mockRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })

    it('should reload monthly transactions after delete', async () => {
      await service.deleteTransaction('tx-1', 2026, 4)

      expect(mockRepo.delete).toHaveBeenCalledWith('tx-1')
      expect(mockRepo.getByMonth).toHaveBeenCalledWith(2026, 4)
    })
  })

  describe('Reactivity', () => {
    it('should emit transactions list through observable when loaded', async () => {
      const mockList: any[] = [{ id: '1', title: 'T1' }]
      vi.mocked(mockRepo.getByMonth).mockResolvedValue(mockList)

      let received: any[] = []
      service.transactions$.subscribe(val => received = val)

      await service.loadMonthlyTransactions(2026, 4)

      expect(received).toEqual(mockList)
    })
  })
})
