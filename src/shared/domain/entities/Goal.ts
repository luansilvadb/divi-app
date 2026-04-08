export interface Goal {
  id: string
  user_id: string
  name: string
  target_value: number
  current_value: number
  type: 'saving' | 'debt'
  color?: string
  icon?: string
  syncStatus: 'synced' | 'pending' | 'failed'
  created_at?: string
}
