import type { IActivityRepository } from '../core/ports/IActivityRepository'
import type { IActivity } from '../core/entities/IActivity'
import { vaultDb as db } from '@/infrastructure/storage/VaultDatabase'

export class DexieActivityRepository implements IActivityRepository {
  async getAll(): Promise<IActivity[]> {
    const list = await db.activities.orderBy('timestamp').reverse().limit(50).toArray()
    return list as unknown as IActivity[]
  }

  async add(activity: IActivity): Promise<void> {
    await db.activities.add(activity as any)
  }
}
