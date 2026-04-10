import type { Activity } from '../entities/Activity'

export interface IActivityLogService {
  getRecentActivities(): Promise<Activity[]>
  logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<void>
}

