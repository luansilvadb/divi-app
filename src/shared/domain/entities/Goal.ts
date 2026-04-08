import type { SyncMetadata } from './SyncMetadata'

export interface Goal extends SyncMetadata {
  name: string
  target_value: number
  current_value: number
  type: 'saving' | 'debt'
  color?: string
  icon?: string
}
