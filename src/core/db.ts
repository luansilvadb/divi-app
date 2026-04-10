import Dexie, { type Table } from 'dexie'
import type { SyncMetadata } from '@/shared/domain/entities/SyncMetadata'

export type { SyncMetadata }

export interface LocalTransaction extends SyncMetadata {
  title: string
  amount: number
  type: 'income' | 'expense'
  category_id: string
  wallet_id: string
  payee_id?: string
  date: string
  notes?: string
}

export interface LocalWallet extends SyncMetadata {
  name: string
  balance: number
  currency: string
}

export interface LocalCategory extends SyncMetadata {
  name: string
  icon?: string
  color?: string
}

export interface LocalPayee extends SyncMetadata {
  name: string
}

export interface LocalLoan extends SyncMetadata {
  name: string
  total_value: number
  remaining_value: number
  interest_rate?: number
  due_date: string
}

export interface LocalSubscription extends SyncMetadata {
  name: string
  amount: number
  category_id: string
  wallet_id: string
  billing_day: number
  frequency: 'monthly' | 'yearly'
  last_billed_at?: string
}

export interface LocalActivity {
  id: string
  timestamp: string
  action: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  user_id?: string
}

export interface LocalBudget extends SyncMetadata {
  name: string
  type: 'spending' | 'saving'
  limit_value: number
  period_start: string
  period_end: string
  color?: string
  categories?: string[]
  wallets?: string[]
}

export interface LocalGoal extends SyncMetadata {
  name: string
  target_value: number
  current_value: number
  type: 'saving' | 'debt'
  color?: string
  icon?: string
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

  constructor() {
    // New database name for the fresh sync engine foundation
    super('DiviDB_v2')
    
    this.version(1).stores({
      transactions: 'id, user_id, date, sync_status, deleted, payee_id',
      wallets: 'id, user_id, name, sync_status, deleted',
      categories: 'id, user_id, name, sync_status, deleted',
      payees: 'id, user_id, name, sync_status, deleted',
      loans: 'id, user_id, name, sync_status, deleted',
      subscriptions: 'id, user_id, name, sync_status, deleted',
      activities: 'id, user_id, timestamp',
      budgets: 'id, user_id, name, sync_status, deleted',
      goals: 'id, user_id, name, sync_status, deleted'
    })

    this.setupSyncHooks()
  }

  private setupSyncHooks() {
    const syncableTables = [
      this.transactions, this.wallets, this.categories, this.payees,
      this.loans, this.subscriptions, this.budgets, this.goals
    ]

    syncableTables.forEach(table => {
      // Trigger sync after any change
      table.hook('creating', (_, obj: any) => {
        if (!obj.sync_status) {
          obj.sync_status = 'pending'
          obj.client_updated_at = new Date().toISOString()
        }
      })

      table.hook('updating', (mods: any) => {
        // Only mark as pending if sync_status is NOT explicitly being set to a non-pending value
        // (Allows SyncEngine to set 'synced' or 'failed')
        if (mods.sync_status === undefined) {
          return {
            ...mods,
            sync_status: 'pending',
            client_updated_at: new Date().toISOString()
          }
        }
      })
    })
  }
}

export const db = new DiviDatabase()
