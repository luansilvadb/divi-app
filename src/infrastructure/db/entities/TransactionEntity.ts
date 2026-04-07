export interface TransactionEntity {
  id: string
  user_id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category_id: string
  wallet_id: string
  payee_id?: string
  date: string
  notes?: string
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  created_at: string
  updated_at: string
}
