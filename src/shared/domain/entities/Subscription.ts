export interface Subscription {
  id: string
  user_id: string
  name: string
  amount: number
  category_id?: string
  wallet_id?: string
  billing_day: number
  frequency: 'monthly' | 'yearly'
  next_billing_date?: string
  last_billed_at?: string
  syncStatus: 'synced' | 'pending' | 'failed'
  created_at?: string
}
