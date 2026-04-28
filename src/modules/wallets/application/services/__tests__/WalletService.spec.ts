import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest'
import { WalletService } from '../WalletService'
import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import { useAuthStore } from '@/modules/auth/application/authStore'
import { take } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'

// Mock store
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: vi.fn(),
}))

describe('WalletService', () => {
  let mockRepo: Mocked<IWalletRepository>
  let authStoreMock: any
  let service: WalletService

  beforeEach(() => {
    vi.clearAllMocks()

    authStoreMock = {
      user: { id: 'test-user-id' }
    }
    vi.mocked(useAuthStore).mockReturnValue(authStoreMock as any)

    mockRepo = {
      getAll: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({} as Wallet),
      update: vi.fn().mockResolvedValue({} as Wallet),
      getById: vi.fn().mockResolvedValue(null),
    }

    service = new WalletService(mockRepo)
  })

  it('deve carregar as carteiras do repositório no BehaviorSubject', async () => {
    const mockWallets: Wallet[] = [
      { id: '1', user_id: 'test-user-id', name: 'Corrente', type: 'checking', balance: 1500n, currency: 'BRL', sync_status: 'pending', created_at: '', client_updated_at: '', version: 1, deleted: false }
    ]
    mockRepo.getAll.mockResolvedValue(mockWallets)

    await service.loadWallets()

    const currentWallets = await firstValueFrom(service.wallets$)
    expect(currentWallets).toEqual(mockWallets)
    expect(mockRepo.getAll).toHaveBeenCalledOnce()
  })

  it('deve criar uma nova carteira com o saldo convertido para BigInt (minor units)', async () => {
    mockRepo.getAll.mockResolvedValue([]) // Mock array vazio após loadWallets

    await service.createWallet({
      name: 'Nubank',
      type: 'checking',
      currency: 'BRL',
      balance: 15.50
    })

    expect(mockRepo.create).toHaveBeenCalledOnce()
    
    // Asserção CRÍTICA: validando se o valor float 15.50 virou 1550n
    const createdWallet = mockRepo.create.mock.calls[0]?.[0]
    if (!createdWallet) throw new Error('Wallet not created')
    expect(createdWallet.name).toBe('Nubank')
    expect(createdWallet.balance).toBeTypeOf('bigint')
    expect(createdWallet.balance).toBe(1550n)
    expect(createdWallet.user_id).toBe('test-user-id')
  })

  it('deve lançar erro ao criar carteira se não houver usuário autenticado', async () => {
    authStoreMock.user = null // Desloga

    await expect(
      service.createWallet({
        name: 'Nubank',
        type: 'checking',
        currency: 'BRL',
        balance: 15.50
      })
    ).rejects.toThrow('User not authenticated')

    expect(mockRepo.create).not.toHaveBeenCalled()
  })
})
