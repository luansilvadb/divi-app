import Dexie, { type Table } from 'dexie'

export interface LocalTransaction {
  id?: string
  localId?: string
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
  is_dirty: number
  last_modified_at: string
  deleted: boolean
  updated_at: string
}

export interface LocalWallet {
  id?: string
  user_id: string
  name: string
  balance: number
  currency: string
  syncStatus: 'synced' | 'pending' | 'failed'
  is_dirty: number
  last_modified_at: string
  deleted: boolean
  updated_at: string
}

export interface LocalCategory {
  id?: string
  name: string
  icon?: string
  color?: string
  syncStatus: 'synced' | 'pending' | 'failed'
  is_dirty: number
  last_modified_at: string
  deleted: boolean
  updated_at: string
}

export interface LocalPayee {
  id?: string
  name: string
  user_id: string
  syncStatus: 'synced' | 'pending' | 'failed'
  is_dirty: number
  last_modified_at: string
  deleted: boolean
  updated_at: string
}

export interface LocalLoan {
  id: string
  user_id: string
  name: string
  total_value: number
  remaining_value: number
  interest_rate?: number
  due_date: string
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  updated_at: string
  version: number
  created_at?: string
}

export interface LocalSubscription {
  id: string
  user_id: string
  name: string
  amount: number
  category_id: string
  wallet_id: string
  billing_day: number
  frequency: 'monthly' | 'yearly'
  last_billed_at?: string
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  updated_at: string
  version: number
  created_at?: string
}

export interface LocalActivity {
  id: string
  timestamp: string
  action: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface LocalBudget {
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
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  updated_at: string
  version: number
  created_at?: string
}

export interface LocalGoal {
  id: string
  user_id: string
  name: string
  target_value: number
  current_value: number
  type: 'saving' | 'debt'
  color?: string
  icon?: string
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  updated_at: string
  version: number
  created_at?: string
}

// Removed SyncQueue and SyncQuarantine interfaces as they are no longer needed

export class DiviDatabase extends Dexie {
  transactions!: Table<LocalTransaction>
  wallets!: Table<LocalWallet>
  categories!: Table<LocalCategory>
  payees!: Table<LocalPayee>
  loans!: Table<LocalLoan>
  subscriptions!: Table<LocalSubscription>
  activities!: Table<LocalActivity>
  budgets!: Table<LocalBudget>
  goals!: Table<LocalGoal>

  constructor() {
    super('DiviDB_Legacy')
    this.version(9).stores({
      transactions: '++localId, id, date, is_dirty, deleted',
      wallets: '++id, name, is_dirty, deleted',
      categories: '++id, name, is_dirty, deleted',
      payees: '++id, name, is_dirty, deleted',
      loans: 'id, name, is_dirty, deleted',
      subscriptions: 'id, name, is_dirty, deleted',
      activities: 'id, timestamp',
      budgets: 'id, name, type, is_dirty, deleted',
      goals: 'id, name, type, is_dirty, deleted'
    })
  }
}

export const db = new DiviDatabase()
