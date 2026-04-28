import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

export interface IBudget extends ISyncMetadata {
  category_id: string
  limit_value: bigint
  period: 'monthly'
  name?: string
}
