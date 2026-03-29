export interface Wallet {
  id: string
  name: string
  balance: number
  currency: string
  user_id: string
  created_at?: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
  parent_id?: string
  user_id?: string // system categories don't have user_id
}

export interface Payee {
  id: string
  name: string
  user_id: string
}

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
  synced: boolean
  deleted: boolean
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  name: string
  type: 'spending' | 'saving'
  limit_value: number
  period_start: string
  period_end: string
  color?: string
  categories?: string[]
  wallets?: string[]
  created_at?: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_value: number
  current_value: number
  type: 'saving' | 'debt'
  color?: string
  icon?: string
  created_at?: string
}

export interface Loan {
  id: string
  user_id: string
  name: string
  total_value: number
  remaining_value: number
  interest_rate?: number
  due_date: string
  created_at?: string
}

export interface Subscription {
  id: string
  user_id: string
  name: string
  amount: number
  category_id: string
  wallet_id: string
  billing_day: number
  frequency: 'monthly' | 'yearly'
  last_billed_at?: string
  created_at?: string
}
