import type { ICategoryRepository } from '../core/ports/ICategoryRepository'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'
import { vaultDb as db, type ILocalCategory } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexieCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<ICategory[]> {
    const list = await db.categories.toArray()
    return list.map((item) => ({
      ...item,
      sync_status: item.sync_status,
      client_updated_at: item.client_updated_at,
      version: item.version || 1,
    })) as ICategory[]
  }

  async create(category: Omit<ICategory, 'id' | 'created_at' | 'sync_status' | 'version' | 'deleted'>): Promise<ICategory> {
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
      } as ILocalCategory)
    })

    SyncEngine.getInstance().enqueueSync()
    const result = await db.categories.get(id)
    return result as ICategory
  }

  async update(id: string, category: Partial<ICategory>): Promise<ICategory> {
    await db.transaction('rw', db.categories, async () => {
      await db.categories.update(id, {
        ...category,
        sync_status: 'pending',
        client_updated_at: new Date().toISOString(),
      })
    })

    SyncEngine.getInstance().enqueueSync()
    const result = await db.categories.get(id)
    return result as ICategory
  }

  async delete(id: string): Promise<void> {
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
  }
}
