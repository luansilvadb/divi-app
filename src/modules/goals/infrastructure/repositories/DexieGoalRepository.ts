import type { IGoalRepository } from '@/shared/domain/contracts/IGoalRepository'
import type { Goal } from '@/shared/domain/entities/Goal'
import { db } from '@/core/db'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexieGoalRepository implements IGoalRepository {
  async getAll(): Promise<Goal[]> {
    const list = await db.goals.filter((g) => !g.deleted).toArray()
    return list as Goal[]
  }

  async save(goal: Goal): Promise<void> {
    const data: Goal = {
      ...goal,
      sync_status: goal.sync_status || 'pending',
      deleted: !!goal.deleted,
      client_updated_at: goal.client_updated_at || new Date().toISOString(),
      created_at: goal.created_at || new Date().toISOString(),
      version: goal.version || 1,
    }
    await db.goals.put(data)
    SyncEngine.getInstance().enqueueSync()
    console.debug('[DexieGoalRepository] Meta salva localmente. Sync disparado.')
  }

  async delete(id: string): Promise<void> {
    // Soft delete for sync engine
    await db.goals.update(id, {
      deleted: true,
      sync_status: 'pending',
      client_updated_at: new Date().toISOString(),
    })
    SyncEngine.getInstance().enqueueSync()
    console.debug('[DexieGoalRepository] Meta marcada para deleção. Sync disparado.')
  }
}
