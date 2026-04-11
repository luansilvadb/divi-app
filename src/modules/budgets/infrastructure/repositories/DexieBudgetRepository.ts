import { liveQuery } from 'dexie'
import { from, type Observable } from 'rxjs'
import type { IBudgetRepository } from '@/shared/domain/contracts/IBudgetRepository'
import type { Budget } from '@/shared/domain/entities/Budget'
import { db } from '@/core/db'

export class DexieBudgetRepository implements IBudgetRepository {
  async getAllActive(): Promise<Budget[]> {
    const list = await db.budgets
      .filter(b => !b.deleted)
      .toArray()
    return list as Budget[]
  }

  watchAll(): Observable<Budget[]> {
    return from(liveQuery(() => 
      db.budgets
        .filter(b => !b.deleted)
        .toArray()
    ) as unknown as Observable<Budget[]>)
  }

  async save(budget: Budget): Promise<void> {
    await db.budgets.put(budget)
  }

  async delete(id: string): Promise<void> {
    await db.budgets.update(id, { deleted: true, sync_status: 'pending' })
  }
}
