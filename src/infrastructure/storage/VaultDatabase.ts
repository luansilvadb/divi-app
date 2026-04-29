import Dexie, { type Table } from 'dexie'
import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'
import { MigrationRunner } from '@/core/migrations/MigrationRunner'
// Side-effect import: registers all migrations in MigrationRegistry
import '@/core/migrations/dexie'

// Import local storage entity types
import type {
  ILocalITransaction,
  ILocalIWallet,
  ILocalCategory,
  ILocalPayee,
  ILocalLoan,
  ILocalSubscription,
  ILocalActivity,
  ILocalBudget,
  ILocalGoal,
} from './types'

// Re-export all local storage types for backward compatibility
export type {
  ILocalITransaction,
  ILocalIWallet,
  ILocalCategory,
  ILocalLoan,
  ILocalSubscription,
  ILocalBudget,
  ILocalGoal,
} from './types'

export type { ISyncMetadata }

/**
 * VaultDatabase (Porteiro da Soberania)
 * Baseado no Dexie.js para persistência atômica local.
 */
export class VaultDatabase extends Dexie {
  transactions!: Table<ILocalITransaction>
  wallets!: Table<ILocalIWallet>
  categories!: Table<ILocalCategory>
  payees!: Table<ILocalPayee>
  loans!: Table<ILocalLoan>
  subscriptions!: Table<ILocalSubscription>
  activities!: Table<ILocalActivity>
  budgets!: Table<ILocalBudget>
  goals!: Table<ILocalGoal>

  constructor() {
    // Mantendo o nome físico 'DiviDB_v2' para preservar dados existentes
    super('DiviDB_v2')

    // Aplicar migrações registradas
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
      table.hook('creating', (_, obj: ISyncMetadata) => {
        if (!obj.sync_status) {
          obj.sync_status = 'pending'
          obj.client_updated_at = new Date().toISOString()
        }
        if (obj.version === undefined) {
          obj.version = 1
        }
        if (obj.deleted === undefined) {
          obj.deleted = false
        }
      })

      table.hook('updating', (mods: Partial<ISyncMetadata>, _primKey, obj: ISyncMetadata) => {
        // Se sync_status não for explicitamente alterado, incrementa a versão
        if (mods.sync_status === undefined) {
          return {
            ...mods,
            sync_status: 'pending',
            client_updated_at: new Date().toISOString(),
            version: (obj.version || 1) + 1,
          }
        }
      })
    })
  }

  async clearAllData() {
    console.warn('[VaultDatabase] Clearing all local data...')
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

// Named instance for DI
export const vaultDb = new VaultDatabase()

