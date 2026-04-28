import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface ILocalGoal extends ISyncMetadata {
  name: string
  target_value: bigint
  current_value: bigint
  type: 'saving' | 'debt'
  color?: string
  icon?: string
}
