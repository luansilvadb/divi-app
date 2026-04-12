import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { ICategoryRepository } from '@/shared/domain/contracts/ICategoryRepository'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import type { Category } from '@/shared/domain/entities/Category'
import { db, type LocalWallet, type LocalCategory } from '@/core/db'
import { SyncEngine } from '@/core/sync/SyncEngine'
import { InfrastructureError } from '../../domain/errors'

export class DexieWalletRepository implements IWalletRepository {
  async getAll(): Promise<Wallet[]> {
    try {
      const list = await db.wallets.toArray()
      return list.map((item) => ({
        ...item,
        sync_status: item.sync_status,
        client_updated_at: item.client_updated_at,
        version: item.version || 1,
      })) as Wallet[]
    } catch (err) {
      throw new InfrastructureError('Failed to get wallets from local DB', err)
    }
  }

  async save(wallet: Wallet): Promise<void> {
    try {
      await db.wallets.put({
        ...wallet,
        sync_status: wallet.sync_status || 'pending',
        client_updated_at: wallet.client_updated_at || new Date().toISOString(),
        created_at: wallet.created_at || new Date().toISOString(),
        version: wallet.version || 1,
      } as LocalWallet)

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieWalletRepository] Carteira salva localmente. Sync disparado.')
    } catch (err) {
      throw new InfrastructureError('Failed to save wallet to local DB', err)
    }
  }

  async getById(id: string): Promise<Wallet | null> {
    try {
      const w = await db.wallets.get(id)
      return w ? (w as Wallet) : null
    } catch (err) {
      throw new InfrastructureError('Failed to get wallet by ID from local DB', err)
    }
  }
}

export class DexieCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    try {
      const list = await db.categories.toArray()
      return list.map((item) => ({
        ...item,
        sync_status: item.sync_status,
        client_updated_at: item.client_updated_at,
        version: item.version || 1,
      })) as Category[]
    } catch (err) {
      throw new InfrastructureError('Failed to get categories from local DB', err)
    }
  }

  async save(category: Category): Promise<void> {
    try {
      await db.categories.put({
        ...category,
        sync_status: category.sync_status || 'pending',
        client_updated_at: category.client_updated_at || new Date().toISOString(),
        created_at: category.created_at || new Date().toISOString(),
        version: category.version || 1,
      } as LocalCategory)

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieCategoryRepository] Categoria salva localmente. Sync disparado.')
    } catch (err) {
      throw new InfrastructureError('Failed to save category to local DB', err)
    }
  }
}
