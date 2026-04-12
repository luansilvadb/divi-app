import Dexie, { type Table } from 'dexie'
import type { SyncMetadata } from '@/shared/domain/entities/SyncMetadata'
import { MigrationRunner } from './migrations/MigrationRunner'
// Side-effect import: registers all migrations in MigrationRegistry
import './migrations/dexie'

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
  tags?: string[]
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
  category_id: string
  limit_value: number
  period: 'monthly'
  name?: string
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
    // DB name MUST remain 'DiviDB_v2' to preserve existing data
    super('DiviDB_v2')

    // Apply all registered migrations via the MigrationRunner
    MigrationRunner.applyAll(this)

    this.setupSyncHooks()
  }

  private setupSyncHooks() {
    const syncableTables = [
      this.transactions,
      this.wallets,
      this.categories,
      this.payees,
      this.loans,
      this.subscriptions,
      this.budgets,
      this.goals,
    ]

    syncableTables.forEach((table) => {
      // Trigger sync after any change
      table.hook('creating', (_, obj: SyncMetadata) => {
        if (!obj.sync_status) {
          obj.sync_status = 'pending'
          obj.client_updated_at = new Date().toISOString()
        }
      })

      table.hook('updating', (mods: Partial<SyncMetadata>) => {
        // Only mark as pending if sync_status is NOT explicitly being set to a non-pending value
        // (Allows SyncEngine to set 'synced' or 'failed')
        if (mods.sync_status === undefined) {
          return {
            ...mods,
            sync_status: 'pending',
            client_updated_at: new Date().toISOString(),
          }
        }
      })
    })
  }

  async clearAllData() {
    console.warn('[Database] Clearing all local data...')
    await Promise.all([
      this.transactions.clear(),
      this.wallets.clear(),
      this.categories.clear(),
      this.payees.clear(),
      this.loans.clear(),
      this.subscriptions.clear(),
      this.activities.clear(),
      this.budgets.clear(),
      this.goals.clear(),
    ])
  }
}

export const db = new DiviDatabase()
