export interface Transaction {
  id: string
  localId?: number // for Dexie
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category_id: string
  wallet_id: string
  payee_id?: string
  user_id: string
  notes?: string
  synced: boolean
  deleted: boolean
  created_at: string
  updated_at: string
}
