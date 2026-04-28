import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

export interface ITransaction extends ISyncMetadata {
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
