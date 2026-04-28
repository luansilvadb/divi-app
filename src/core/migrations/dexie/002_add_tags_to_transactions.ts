import type { IDexieMigration } from '../types'

/**
 * Migration 002 - Add Tags to transactions
 *
 * EXAMPLE MIGRATION: Demonstrates how to add a new indexed field
 * and transform existing data during the upgrade.
 *
 * Changes:
 * - Adds 'tags' multi-entry index to the transactions table
 * - Upgrade: initializes `tags: []` on all existing transactions
 * - Downgrade: removes the `tags` field from all records
 */
export const migration002AddTagsTotransactions: IDexieMigration = {
  version: 2,
  name: 'add_tags_to_transactions',
  description: 'Adds a tags multi-entry index to transactions for categorization.',
  createdAt: '2026-04-12T02:00:00Z',
  stores: {
    // Repeat ALL tables. Dexie requires the full store map for each version.
    // Only transactions changed: added '*tags' (multi-entry index).
    transactions: 'id, user_id, date, sync_status, deleted, payee_id, *tags',
    wallets: 'id, user_id, name, sync_status, deleted',
    categories: 'id, user_id, name, sync_status, deleted',
    payees: 'id, user_id, name, sync_status, deleted',
    loans: 'id, user_id, name, sync_status, deleted',
    subscriptions: 'id, user_id, name, sync_status, deleted',
    activities: 'id, user_id, timestamp',
    budgets: 'id, user_id, name, sync_status, deleted',
    goals: 'id, user_id, name, sync_status, deleted',
  },
  upgrade: async (tx) => {
    // Add empty tags array to all existing transactions
    const transactions = tx.table('transactions')
    await transactions.toCollection().modify((record: Record<string, unknown>) => {
      if (!record.tags) {
        record.tags = []
      }
    })
  },
  downgrade: async (tx) => {
    // Remove tags field from all transactions
    const transactions = tx.table('transactions')
    await transactions.toCollection().modify((record: Record<string, unknown>) => {
      delete record.tags
    })
  },
}
