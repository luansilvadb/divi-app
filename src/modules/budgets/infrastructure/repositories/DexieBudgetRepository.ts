import { liveQuery } from 'dexie'
import { from, type Observable } from 'rxjs'
import { v7 as uuidv7 } from 'uuid'
import type { IBudgetRepository } from '@/shared/domain/contracts/IBudgetRepository'
import type { Budget } from '@/shared/domain/entities/Budget'
import { db } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexieBudgetRepository implements IBudgetRepository {
  async getAllActive(): Promise<Budget[]> {
    const budgets = await db.budgets.filter((b) => !b.deleted).toArray()
    return budgets as Budget[]
  }

  watchAll(): Observable<Budget[]> {
    return from(
      liveQuery(() => db.budgets.filter((b) => !b.deleted).toArray()) as unknown as Observable<
        Budget[]
      >,
    )
  }

  async save(budget: Budget): Promise<void> {
    try {
      await db.transaction('rw', db.budgets, async () => {
        const id = budget.id || uuidv7()
        const data = {
          ...budget,
          id,
          limit_value: BigInt(budget.limit_value ?? 0),
          sync_status: budget.sync_status || 'pending',
          client_updated_at: budget.client_updated_at || new Date().toISOString(),
          created_at: budget.created_at || new Date().toISOString(),
          deleted: !!budget.deleted,
          version: budget.version || 1,
        }
        await db.budgets.put(data)
      })
      SyncEngine.getInstance().enqueueSync()
    } catch (err) {
      console.error('[DexieBudgetRepository] Failed to save budget', err)
      throw err
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.transaction('rw', db.budgets, async () => {
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
