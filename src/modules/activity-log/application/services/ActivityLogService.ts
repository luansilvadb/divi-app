import type { IActivityLogService } from '../core/ports/IActivityLogService'
import type { IActivityRepository } from '../core/ports/IActivityRepository'
import type { IActivity } from '../core/entities/IActivity'

export class ActivityLogService implements IActivityLogService {
  constructor(private activityRepo: IActivityRepository) {}

  async getRecentActivities(): Promise<IActivity[]> {
    return this.activityRepo.getAll()
  }

  async logActivity(activity: Omit<IActivity, 'id' | 'timestamp'>): Promise<void> {
    const newActivity: IActivity = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...activity,
    }
    await this.activityRepo.add(newActivity)
  }
}
