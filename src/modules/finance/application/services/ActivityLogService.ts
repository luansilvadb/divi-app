import type { IActivityLogService, Activity } from '../../domain/services/IActivityLogService'
import { db } from '../../../../core/db'

export class ActivityLogService implements IActivityLogService {
  async getRecentActivities(): Promise<Activity[]> {
    const list = await db.activities
      .orderBy('timestamp')
      .reverse()
      .limit(50)
      .toArray()
    return list as Activity[]
  }

  async logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<void> {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...activity
    }
    await db.activities.add(newActivity)
  }
}
