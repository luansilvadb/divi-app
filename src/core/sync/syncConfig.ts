/**
 * Configuration for the SyncEngine.
 * Centralized list of all entities that should be synchronized with Supabase.
 */
export const SYNCABLE_TABLES = [
  'transactions',
  'wallets',
  'categories',
  'payees',
  'loans',
  'subscriptions',
  'budgets',
  'goals'
] as const

export type SyncableTable = (typeof SYNCABLE_TABLES)[number]
