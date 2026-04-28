import type { IGoalRepository } from '../core/ports/IGoalRepository'
import type { IGoal } from '@/modules/goals/core/entities/IGoal'
import { db } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexieGoalRepository implements IGoalRepository {
  async getAll(): Promise<IGoal[]> {
    const goals = await db.goals.filter((g) => !g.deleted).toArray()
    return goals as IGoal[]
  }

  async save(goal: IGoal): Promise<void> {
    try {
      await db.ITransaction('rw', db.goals, async () => {
        const data = {
          ...goal,
          target_value: BigInt(goal.target_value),
          current_value: BigInt(goal.current_value),
          sync_status: goal.sync_status || 'pending',
          deleted: !!goal.deleted,
          client_updated_at: goal.client_updated_at || new Date().toISOString(),
          created_at: goal.created_at || new Date().toISOString(),
          version: goal.version || 1,
        }
        await db.goals.put(data)
      })
      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieGoalRepository] Meta salva localmente de forma atômica.')
    } catch (err) {
      console.error('[DexieGoalRepository] Failed to save goal', err)
      throw err
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.ITransaction('rw', db.goals, async () => {
        // Soft delete for sync engine
        await db.goals.update(id, {
          deleted: true,
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
        })
      })
      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieGoalRepository] Meta marcada para deleção de forma atômica.')
    } catch (err) {
      console.error('[DexieGoalRepository] Failed to delete goal', err)
      throw err
    }
  }
}
