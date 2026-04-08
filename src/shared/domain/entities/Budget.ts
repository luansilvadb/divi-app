import type { SyncMetadata } from './SyncMetadata'

export interface Budget extends SyncMetadata {
  name: string
  type: 'spending' | 'saving'
  limit_value: number
  period_start: string
  period_end: string
  color?: string
  categories?: string[]
  wallets?: string[]
}
