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
  synced: boolean
  deleted: boolean
  updated_at: string
}

export interface LocalWallet {
  id?: string
  user_id: string
  name: string
  balance: number
  currency: string
  synced: boolean
}

export interface LocalCategory {
  id?: string
  name: string
  icon?: string
  color?: string
  synced: boolean
}

export interface LocalPayee {
  id?: string
  name: string
  user_id: string
  synced: boolean
}

export interface LocalLoan {
  id: string
  user_id: string
  name: string
  total_value: number
  remaining_value: number
  interest_rate?: number
  due_date: string
  synced: boolean
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
  synced: boolean
  created_at?: string
}

export interface LocalActivity {
  id: string
  timestamp: string
  action: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export class DiviDatabase extends Dexie {
  transactions!: Table<LocalTransaction>
  wallets!: Table<LocalWallet>
  categories!: Table<LocalCategory>
  payees!: Table<LocalPayee>
  loans!: Table<LocalLoan>
  subscriptions!: Table<LocalSubscription>
  activities!: Table<LocalActivity>

  constructor() {
    super('DiviDB')
    this.version(1).stores({
      transactions: '++localId, id, date, synced, deleted',
      wallets: '++id, name, synced',
      categories: '++id, name, synced',
      payees: '++id, name, synced',
      loans: 'id, name, synced',
      subscriptions: 'id, name, synced',
      activities: 'id, timestamp'
    })
  }
}

export const db = new DiviDatabase()
