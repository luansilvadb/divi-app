export interface Budget {
  id: string
  user_id: string
  name: string
  type: 'spending' | 'saving'
  limit_value: number
  period_start: string
  period_end: string
  color?: string
  categories?: string[]
  wallets?: string[]
  syncStatus: 'synced' | 'pending' | 'failed'
  created_at?: string
}
