import type { SyncMetadata } from '@/shared/domain/entities/SyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalBudget extends SyncMetadata {
  category_id: string
  limit_value: bigint
  period: 'monthly'
  name?: string
}
