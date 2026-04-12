import type { Transaction } from 'dexie'

/**
 * Defines the contract for a single Dexie schema migration.
 * Each migration is a self-contained, versioned unit of change.
 */
export interface DexieMigration {
  /** Sequential version number (1, 2, 3...). Must be unique and gap-free. */
  version: number
  /** Short, descriptive name (e.g., 'initial_schema') */
  name: string
  /** Human-readable description of what this migration does */
  description: string
  /** ISO 8601 timestamp of when this migration was authored */
  createdAt: string
  /**
   * Dexie store definitions.
   * Keys are table names, values are comma-separated index strings.
   * A `null` value drops the table.
   */
  stores: Record<string, string | null>
  /** Optional data transformation applied when upgrading to this version */
  upgrade?: (tx: Transaction) => Promise<void>
  /** Optional data transformation applied when rolling back from this version */
  downgrade?: (tx: Transaction) => Promise<void>
}

/**
 * Result of applying a single migration.
 */
export interface MigrationResult {
  version: number
  name: string
  status: 'applied' | 'skipped' | 'failed'
  error?: string
  /** Duration in milliseconds */
  duration: number
}

/**
 * Contextual information passed during migration execution.
 */
export interface MigrationContext {
  /** Reference to the Dexie database instance */
  db: unknown
  /** The version the database was at before this migration */
  previousVersion: number
  /** The version this migration targets */
  targetVersion: number
}
