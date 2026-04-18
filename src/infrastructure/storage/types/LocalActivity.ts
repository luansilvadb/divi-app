/**
 * Activity log entry for tracking user actions.
 */
export interface LocalActivity {
  id: string
  timestamp: string
  action: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  user_id?: string
}
