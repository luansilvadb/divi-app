import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { ICategoryRepository } from '@/shared/domain/contracts/ICategoryRepository'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import type { Category } from '@/shared/domain/entities/Category'
import { db, type LocalWallet, type LocalCategory } from '@/infrastructure/storage/VaultDatabase'
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

  async create(wallet: Omit<Wallet, 'id' | 'created_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Wallet> {
    try {
      const id = `wallet_${Date.now()}`
      const created_at = new Date().toISOString()
      const version = 1
      const deleted = false
      const sync_status = 'pending'

      await db.transaction('rw', db.wallets, async () => {
        await db.wallets.put({
          ...wallet,
          id,
          balance: BigInt(wallet.balance),
          type: wallet.type || 'checking',
          sync_status,
          client_updated_at: created_at,
          created_at,
          version,
          deleted,
        } as LocalWallet)
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieWalletRepository] Carteira criada localmente de forma atômica.')
      const result = await db.wallets.get(id)
      return result as Wallet
    } catch (err) {
      throw new InfrastructureError('Failed to create wallet in local DB', err)
    }
  }

  async update(id: string, wallet: Partial<Wallet>): Promise<Wallet> {
    try {
      await db.transaction('rw', db.wallets, async () => {
        await db.wallets.update(id, {
          ...wallet,
          balance: wallet.balance !== undefined ? BigInt(wallet.balance) : undefined,
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
        })
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieWalletRepository] Carteira atualizada localmente de forma atômica.')
      const result = await db.wallets.get(id)
      return result as Wallet
    } catch (err) {
      throw new InfrastructureError('Failed to update wallet in local DB', err)
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

  async create(category: Omit<Category, 'id' | 'created_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Category> {
    try {
      const id = `cat_${Date.now()}`
      const created_at = new Date().toISOString()
      const version = 1
      const deleted = false
      const sync_status = 'pending'

      await db.transaction('rw', db.categories, async () => {
        await db.categories.put({
          ...category,
          id,
          sync_status,
          client_updated_at: created_at,
          created_at,
          version,
          deleted,
        } as LocalCategory)
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieCategoryRepository] Categoria criada localmente de forma atômica.')
      const result = await db.categories.get(id)
      return result as Category
    } catch (err) {
      throw new InfrastructureError('Failed to create category in local DB', err)
    }
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    try {
      await db.transaction('rw', db.categories, async () => {
        await db.categories.update(id, {
          ...category,
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
        })
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieCategoryRepository] Categoria atualizada localmente de forma atômica.')
      const result = await db.categories.get(id)
      return result as Category
    } catch (err) {
      throw new InfrastructureError('Failed to update category in local DB', err)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.transaction('rw', db.categories, async () => {
        const item = await db.categories.get(id)
        if (item) {
          await db.categories.update(id, {
            deleted: true,
            sync_status: 'pending',
            client_updated_at: new Date().toISOString()
          })
        }
      })
      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieCategoryRepository] Categoria deletada atômicamente (soft-delete).')
    } catch (err) {
      throw new InfrastructureError('Failed to delete category in local DB', err)
    }
  }
}
