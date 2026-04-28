import type { ICategory } from '@/modules/categories/core/entities/ICategory'
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'

export interface IAutoCreateService {
  resolveCategory(categoryId: string | null, categories: ICategory[]): Promise<string | null>
  resolveIWallet(IWalletId: string | null, wallets: IWallet[]): Promise<string | null>
}
