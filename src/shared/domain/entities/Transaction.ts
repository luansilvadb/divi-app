export interface Transaction {
  id: string
  localId?: string // for Dexie
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category_id: string
  wallet_id: string
  payee_id?: string
  user_id: string
  notes?: string
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  created_at: string
  updated_at: string
}

