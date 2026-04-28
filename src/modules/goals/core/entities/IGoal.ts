import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

export interface IGoal extends ISyncMetadata {
  name: string
  target_value: bigint
  current_value: bigint
  type: 'saving' | 'debt'
  color?: string
  icon?: string
}
