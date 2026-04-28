import type { SyncMetadata } from './SyncMetadata'

export interface Loan extends SyncMetadata {
  name: string
  description?: string
  total_value: bigint
  remaining_value: bigint
  interest_rate: number
  due_date: string
  status: 'active' | 'paid' | 'overdue'
}
