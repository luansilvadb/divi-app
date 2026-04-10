import type { Wallet } from '../entities/Wallet'

export interface IWalletRepository {
  getAll(): Promise<Wallet[]>
  save(wallet: Wallet): Promise<void>
  getById(id: string): Promise<Wallet | null>
}

