import type { Wallet } from '../entities/Wallet'

export interface IWalletRepository {
  getAll(): Promise<Wallet[]>
  getById(id: string): Promise<Wallet | null>
  create(wallet: Omit<Wallet, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Wallet>
  update(id: string, wallet: Partial<Wallet>): Promise<Wallet>
}
