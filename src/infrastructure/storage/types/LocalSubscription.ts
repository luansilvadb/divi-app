import type { SyncMetadata } from '@/shared/domain/entities/SyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalSubscription extends SyncMetadata {
  name: string
  amount: bigint
  category_id: string
  wallet_id: string
  billing_day: number
  frequency: 'monthly' | 'yearly'
  last_billed_at?: string
}
