import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalITransaction extends ISyncMetadata {
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
