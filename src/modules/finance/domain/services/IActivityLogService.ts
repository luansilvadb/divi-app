export interface Activity {
  id: string
  timestamp: string
  action: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface IActivityLogService {
  getRecentActivities(): Promise<Activity[]>
  logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<void>
}
