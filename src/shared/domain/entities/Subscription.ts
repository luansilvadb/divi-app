import type { SyncMetadata } from './SyncMetadata'

export interface Subscription extends SyncMetadata {
  name: string
  amount: number
  category_id?: string
  wallet_id?: string
  billing_day: number
  frequency: 'monthly' | 'yearly'
  next_billing_date?: string
  last_billed_at?: string
}

