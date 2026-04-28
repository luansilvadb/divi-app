import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

export interface ISubscription extends ISyncMetadata {
  name: string
  amount: bigint
  category_id?: string
  wallet_id?: string
  billing_day: number
  frequency: 'monthly' | 'yearly'
  next_billing_date?: string
  last_billed_at?: string
}
