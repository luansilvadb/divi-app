export interface Transaction {
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
  deleted: boolean
  created_at: string
  updated_at: string
}

export function createTransaction(data: Transaction): Transaction {
  if (data.amount < 0) {
    throw new Error('Amount must be positive')
  }
  return { ...data }
}

