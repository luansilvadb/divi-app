import type { IWallet } from '../entities/IWallet'

export interface IWalletRepository {
  getAll(): Promise<IWallet[]>
  getById(id: string): Promise<IWallet | null>
  create(IWallet: Omit<IWallet, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<IWallet>
  update(id: string, IWallet: Partial<IWallet>): Promise<IWallet>
}
