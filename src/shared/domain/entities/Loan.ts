import type { SyncMetadata } from './SyncMetadata'

export interface Loan extends SyncMetadata {
  name: string
  description?: string
  total_value: number
  remaining_value: number
  interest_rate: number
  due_date: string
  status: 'active' | 'paid' | 'overdue'
}

