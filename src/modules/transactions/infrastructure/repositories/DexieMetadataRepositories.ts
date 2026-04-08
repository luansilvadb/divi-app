import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { ICategoryRepository } from '@/shared/domain/contracts/ICategoryRepository'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import type { Category } from '@/shared/domain/entities/Category'
import { db, type LocalWallet, type LocalCategory } from '@/core/db'
import { InfrastructureError } from '../../domain/errors'

export class DexieWalletRepository implements IWalletRepository {
  async getAll(): Promise<Wallet[]> {
    try {
      const list = await db.wallets.toArray()
      return list as Wallet[]
    } catch (err) {
      throw new InfrastructureError('Failed to get wallets from local DB', err)
    }
  }

  async save(wallet: Wallet): Promise<void> {
    try {
      await db.wallets.put({ ...wallet, syncStatus: 'pending' } as LocalWallet)
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
      return list as Category[]
    } catch (err) {
      throw new InfrastructureError('Failed to get categories from local DB', err)
    }
  }

  async save(category: Category): Promise<void> {
    try {
      await db.categories.put({ ...category, syncStatus: 'pending' } as LocalCategory)
    } catch (err) {
      throw new InfrastructureError('Failed to save category to local DB', err)
    }
  }
}
