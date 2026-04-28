import type { SyncMetadata } from './SyncMetadata'

export interface Goal extends SyncMetadata {
  name: string
  target_value: bigint
  current_value: bigint
  type: 'saving' | 'debt'
  color?: string
  icon?: string
}
