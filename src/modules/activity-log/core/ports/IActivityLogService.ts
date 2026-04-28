import type { IActivity } from '../entities/IActivity'

export interface IActivityLogService {
  getRecentActivities(): Promise<IActivity[]>
  logActivity(activity: Omit<IActivity, 'id' | 'timestamp'>): Promise<void>
}
