import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

export interface ILoan extends ISyncMetadata {
  name: string
  description?: string
  total_value: bigint
  remaining_value: bigint
  interest_rate: number
  due_date: string
  status: 'active' | 'paid' | 'overdue'
}
