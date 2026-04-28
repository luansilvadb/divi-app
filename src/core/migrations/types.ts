import type { Dexie } from 'dexie'

/**
 * Interface for individual Dexie migrations.
 * Complies with Principle VIII (Interface Naming).
 */
export interface IIDexieMigration {
  version: number
  name: string
  /**
   * Tables that will be modified/created.
   * Key: table name, Value: index string (dexie format).
   */
  stores: Record<string, string | null>
  /**
   * Optional data migration logic.
   */
  upgrade?: (tx: any) => Promise<void> | void
  /**
   * Human readable description of the changes.
   */
  description?: string
}

/**
 * Result of a migration operation.
 */
export interface IMigrationResult {
  version: number
  name: string
  success: boolean
  status: 'applied' | 'failed'
  duration: number
  error?: string
}

/**
 * Context for migration execution.
 */
export interface IMigrationContext {
  db: Dexie
  currentVersion: number
  targetVersion: number
}
