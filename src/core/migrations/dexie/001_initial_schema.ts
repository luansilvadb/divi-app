import type { DexieMigration } from '../types'

/**
 * Migration 001 - Initial Schema
 *
 * Converts the hardcoded schema from db.ts into the first formal migration.
 * This MUST replicate the exact same stores definition that was previously
 * in the DiviDatabase constructor to preserve existing IndexedDB data.
 */
export const migration001InitialSchema: DexieMigration = {
  version: 1,
  name: 'initial_schema',
  description: 'Initial schema matching the original DiviDB_v2 store definitions.',
  createdAt: '2026-04-12T01:00:00Z',
  stores: {
    transactions: 'id, user_id, date, sync_status, deleted, payee_id',
    wallets: 'id, user_id, name, sync_status, deleted',
    categories: 'id, user_id, name, sync_status, deleted',
    payees: 'id, user_id, name, sync_status, deleted',
    loans: 'id, user_id, name, sync_status, deleted',
    subscriptions: 'id, user_id, name, sync_status, deleted',
    activities: 'id, user_id, timestamp',
    budgets: 'id, user_id, name, sync_status, deleted',
    goals: 'id, user_id, name, sync_status, deleted',
  },
  // No upgrade function needed — this is the base schema.
}
