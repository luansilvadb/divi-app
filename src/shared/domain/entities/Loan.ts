export interface Loan {
  id: string
  user_id: string
  name: string
  total_value: number
  remaining_value: number
  interest_rate?: number
  due_date: string
  type?: 'to_pay' | 'to_receive'
  syncStatus: 'synced' | 'pending' | 'failed'
  created_at?: string
}
