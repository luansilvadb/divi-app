import type { IGoalRepository } from '@/shared/domain/contracts/IGoalRepository'
import type { Goal } from '@/shared/domain/entities/Goal'
import { db } from '@/core/db'

export class DexieGoalRepository implements IGoalRepository {
  async getAll(): Promise<Goal[]> {
    const list = await db.table('goals').toArray()
    return list as Goal[]
  }

  async save(goal: Goal): Promise<void> {
    await db.table('goals').put(goal)
  }

  async delete(id: string): Promise<void> {
    await db.table('goals').delete(id)
  }
}
