import type { SyncMetadata } from './SyncMetadata'

export interface Budget extends SyncMetadata {
  category_id: string
  limit_value: bigint
  period: 'monthly'
  name?: string
}
