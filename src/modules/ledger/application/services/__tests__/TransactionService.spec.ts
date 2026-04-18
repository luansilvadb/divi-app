import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TransactionService } from '../TransactionService'
import type { ITransactionRepository } from '@/modules/ledger/domain/contracts/ITransactionRepository'

// Mock the repository
const mockRepository = {
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  transferBetweenWallets: vi.fn(),
} as unknown as ITransactionRepository

describe('TransactionService', () => {
  let service: TransactionService

  beforeEach(() => {
    service = new TransactionService(mockRepository)
    vi.clearAllMocks()
  })

  describe('executeTransfer', () => {
    it('should execute transfer between wallets successfully', async () => {
      // Mock repository response
      mockRepository.transferBetweenWallets.mockResolvedValueOnce(undefined)
      mockRepository.getAll.mockResolvedValueOnce([])

      await service.executeTransfer(
        'wallet1',
        'wallet2',
        1000n,
        'Transferência tática',
        new Date('2026-04-13'),
      )

      expect(mockRepository.transferBetweenWallets).toHaveBeenCalledWith(
        'wallet1',
        'wallet2',
        1000n,
        'Transferência tática',
        new Date('2026-04-13'),
      )
      expect(mockRepository.getAll).toHaveBeenCalled()
    })

    it('should throw error when wallet IDs are invalid', async () => {
      await expect(service.executeTransfer('', 'wallet2', 1000n)).rejects.toThrow(
        'IDs de carteira inválidos',
      )

      await expect(service.executeTransfer('wallet1', '', 1000n)).rejects.toThrow(
        'IDs de carteira inválidos',
      )
    })

    it('should throw error when amount is not positive', async () => {
      await expect(service.executeTransfer('wallet1', 'wallet2', 0n)).rejects.toThrow(
        'Valor deve ser positivo',
      )

      await expect(service.executeTransfer('wallet1', 'wallet2', -100n)).rejects.toThrow(
        'Valor deve ser positivo',
      )
    })

    it('should throw error when wallet IDs are the same', async () => {
      await expect(service.executeTransfer('wallet1', 'wallet1', 1000n)).rejects.toThrow(
        'Carteira de origem e destino não podem ser iguais',
      )
    })
  })
})
