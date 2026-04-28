import type { SyncMetadata } from '@/shared/domain/entities/SyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalGoal extends SyncMetadata {
  name: string
  target_value: bigint
  current_value: bigint
  type: 'saving' | 'debt'
  color?: string
  icon?: string
}
