import type { SyncMetadata } from '@/shared/domain/entities/SyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalTransaction extends SyncMetadata {
  title: string
  amount: bigint
  type: 'income' | 'expense' | 'transfer'
  category_id: string
  wallet_id: string
  payee_id?: string
  date: string
  notes?: string
  tags?: string[]
  transfer_id?: string
}
