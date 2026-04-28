import { liveQuery } from 'dexie'
import { from, type Observable } from 'rxjs'
import { v7 as uuidv7 } from 'uuid'
import type { IBudgetRepository } from '../core/ports/IBudgetRepository'
import type { IBudget } from '@/modules/budgets/core/entities/IBudget'
import { db } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexieBudgetRepository implements IBudgetRepository {
  async getAllActive(): Promise<IBudget[]> {
    const budgets = await db.budgets.filter((b) => !b.deleted).toArray()
    return budgets as IBudget[]
  }

  watchAll(): Observable<IBudget[]> {
    return from(
      liveQuery(() => db.budgets.filter((b) => !b.deleted).toArray()) as unknown as Observable<
        IBudget[]
      >,
    )
  }

  async create(budget: Omit<IBudget, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<IBudget> {
    try {
      const id = uuidv7()
      const created_at = new Date().toISOString()
      const version = 1
      const deleted = false
      const sync_status = 'pending' as const

      await db.ITransaction('rw', db.budgets, async () => {
        const data = {
          ...budget,
          id,
          limit_value: BigInt(budget.limit_value ?? 0),
          sync_status,
          client_updated_at: created_at,
          created_at,
          deleted,
          version,
        }
        await db.budgets.put(data)
      })
      SyncEngine.getInstance().enqueueSync()
      const result = await db.budgets.get(id)
      return result as IBudget
    } catch (err) {
      console.error('[DexieBudgetRepository] Failed to create budget', err)
      throw err
    }
  }

  async update(id: string, budget: Partial<IBudget>): Promise<IBudget> {
    try {
      await db.ITransaction('rw', db.budgets, async () => {
        await db.budgets.update(id, {
          ...budget,
          limit_value: budget.limit_value !== undefined ? BigInt(budget.limit_value) : undefined,
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
        })
      })
      SyncEngine.getInstance().enqueueSync()
      const result = await db.budgets.get(id)
      return result as IBudget
    } catch (err) {
      console.error('[DexieBudgetRepository] Failed to update budget', err)
      throw err
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.ITransaction('rw', db.budgets, async () => {
        await db.budgets.update(id, {
          deleted: true,
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
        })
      })
      SyncEngine.getInstance().enqueueSync()
    } catch (err) {
      console.error('[DexieBudgetRepository] Failed to delete budget', err)
      throw err
    }
  }
}
