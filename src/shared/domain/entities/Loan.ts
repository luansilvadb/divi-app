import type { SyncMetadata } from './SyncMetadata'

export interface Loan extends SyncMetadata {
  title: string
  description?: string
  amount: number
  interestRate: number
  startDate: string
  endDate?: string
  status: 'active' | 'paid' | 'overdue'
}
