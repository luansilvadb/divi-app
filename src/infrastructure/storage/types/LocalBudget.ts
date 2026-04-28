import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalBudget extends ISyncMetadata {
  category_id: string
  limit_value: bigint
  period: 'monthly'
  name?: string
}
