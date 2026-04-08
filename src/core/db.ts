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
  deleted: boolean
  updated_at: string
  version: number
}

export interface LocalWallet {
  id?: string
  user_id: string
  name: string
  balance: number
  currency: string
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  updated_at: string
  version: number
}

export interface LocalCategory {
  id?: string
  name: string
  icon?: string
  color?: string
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  updated_at: string
  version: number
}

export interface LocalPayee {
  id?: string
  name: string
  user_id: string
  syncStatus: 'synced' | 'pending' | 'failed'
  deleted: boolean
  updated_at: string
  version: number
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

export interface LocalSyncQueue {
  id?: number
  table: string
  recordId: string
  action: 'create' | 'update' | 'delete'
  payload: any
  status: 'pending' | 'failed'
  attempts: number
  lastError?: string
  nextRetry: string // ISO Date string
  baseVersion: number
  created_at: string
}

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
  sync_queue!: Table<LocalSyncQueue>

  constructor() {
    super('DiviDB_Legacy')
    this.version(4).stores({
      transactions: '++localId, id, date, syncStatus, deleted',
      wallets: '++id, name, syncStatus',
      categories: '++id, name, syncStatus',
      payees: '++id, name, syncStatus',
      loans: 'id, name, syncStatus',
      subscriptions: 'id, name, syncStatus',
      activities: 'id, timestamp',
      budgets: 'id, name, type, syncStatus',
      goals: 'id, name, type, syncStatus',
      sync_queue: '++id, table, recordId, action, status, nextRetry',
    })
  }
}

export const db = new DiviDatabase()
