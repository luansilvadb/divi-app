import type { IBudgetRepository } from '@/shared/domain/contracts/IBudgetRepository'
import type { Budget } from '@/shared/domain/entities/Budget'
import { db } from '@/core/db'

export class DexieBudgetRepository implements IBudgetRepository {
  async getAllActive(): Promise<Budget[]> {
    const list = await db.table('budgets').toArray()
    return list as Budget[]
  }

  async save(budget: Budget): Promise<void> {
    await db.table('budgets').put(budget)
  }

  async delete(id: string): Promise<void> {
    await db.table('budgets').delete(id)
  }
}
