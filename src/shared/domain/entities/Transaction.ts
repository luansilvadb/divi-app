import type { SyncMetadata } from './SyncMetadata'

export interface Transaction extends SyncMetadata {
  title: string
  amount: bigint
  type: 'income' | 'expense' | 'transfer'
  category_id: string
  wallet_id: string
  payee_id?: string
  date: string
  notes?: string
  tags?: string[]
  localId?: string
  transfer_id?: string
}
