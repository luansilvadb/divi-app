import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface ILocalSubscription extends ISyncMetadata {
  name: string
  amount: bigint
  category_id: string
  wallet_id: string
  billing_day: number
  frequency: 'monthly' | 'yearly'
  last_billed_at?: string
}
