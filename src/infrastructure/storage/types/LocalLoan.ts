import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalLoan extends ISyncMetadata {
  name: string
  total_value: bigint
  remaining_value: bigint
  interest_rate?: number
  due_date: string
}
