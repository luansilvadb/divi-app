import { describe, it, expect, beforeEach } from 'vitest'
import { WalletService } from '../WalletService'
import type { Wallet } from '@/shared/domain/entities/Wallet'

describe('WalletService', () => {
  let walletService: WalletService

  beforeEach(() => {
    walletService = new WalletService()
  })

  it('should initialize with empty wallets', async () => {
    const wallets = await walletService.getAll()
    expect(wallets).toEqual([])
  })

  it('should add a new wallet', async () => {
    const now = new Date().toISOString()
    const walletData = {
      user_id: 'u1',
      name: 'Savings',
      balance: BigInt(1000),
      type: 'savings',
      currency: 'BRL',
      sync_status: 'synced' as const,
      client_updated_at: now,
      created_at: now,
      version: 1,
      deleted: false,
    }

    const newWallet = await walletService.add(walletData)
    expect(newWallet.name).toBe('Savings')
    expect(newWallet.id).toBeDefined()
  })

  it('should update wallets list', async () => {
    const now = new Date().toISOString()
    const wallets: Wallet[] = [
      {
        id: 'w1',
        user_id: 'u1',
        name: 'Checking',
        balance: BigInt(1000),
        type: 'checking',
        currency: 'BRL',
        sync_status: 'synced',
        client_updated_at: now,
        created_at: now,
        version: 1,
        deleted: false,
      },
    ]

    walletService.updateWallets(wallets)
    const result = await walletService.getAll()
    expect(result).toEqual(wallets)
  })

  it('should expose wallets as observable', () => {
    expect(walletService.wallets$).toBeDefined()
  })
})
