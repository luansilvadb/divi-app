import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest'
import { WalletService } from '../WalletService'
import type { IWalletRepository } from '@/modules/wallets/core/ports/IWalletRepository'
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'
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
      create: vi.fn().mockResolvedValue({} as IWallet),
      update: vi.fn().mockResolvedValue({} as IWallet),
      getById: vi.fn().mockResolvedValue(null),
    }

    service = new WalletService(mockRepo)
  })

  it('deve carregar as carteiras do repositório no BehaviorSubject', async () => {
    const mockwallets: IWallet[] = [
      { id: '1', user_id: 'test-user-id', name: 'Corrente', type: 'checking', balance: 1500n, currency: 'BRL', sync_status: 'pending', created_at: '', client_updated_at: '', version: 1, deleted: false }
    ]
    mockRepo.getAll.mockResolvedValue(mockwallets)

    await service.loadwallets()

    const currentwallets = await firstValueFrom(service.wallets$)
    expect(currentwallets).toEqual(mockwallets)
    expect(mockRepo.getAll).toHaveBeenCalledOnce()
  })

  it('deve criar uma nova carteira com o saldo convertido para BigInt (minor units)', async () => {
    mockRepo.getAll.mockResolvedValue([]) // Mock array vazio após loadwallets

    await service.createIWallet({
      name: 'Nubank',
      type: 'checking',
      currency: 'BRL',
      balance: 15.50
    })

    expect(mockRepo.create).toHaveBeenCalledOnce()
    
    // Asserção CRÍTICA: validando se o valor float 15.50 virou 1550n
    const createdIWallet = mockRepo.create.mock.calls[0]?.[0]
    if (!createdIWallet) throw new Error('IWallet not created')
    expect(createdIWallet.name).toBe('Nubank')
    expect(createdIWallet.balance).toBeTypeOf('bigint')
    expect(createdIWallet.balance).toBe(1550n)
    expect(createdIWallet.user_id).toBe('test-user-id')
  })

  it('deve lançar erro ao criar carteira se não houver usuário autenticado', async () => {
    authStoreMock.user = null // Desloga

    await expect(
      service.createIWallet({
        name: 'Nubank',
        type: 'checking',
        currency: 'BRL',
        balance: 15.50
      })
    ).rejects.toThrow('User not authenticated')

    expect(mockRepo.create).not.toHaveBeenCalled()
  })
})
