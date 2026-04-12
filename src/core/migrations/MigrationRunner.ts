import type Dexie from 'dexie'
import type { DexieMigration, MigrationResult } from './types'
import { MigrationRegistry } from './MigrationRegistry'

/**
 * Orchestrates the application of all registered Dexie migrations.
 * Translates each DexieMigration into Dexie's native `.version().stores().upgrade()` calls.
 */
export class MigrationRunner {
  /**
   * Applies all registered migrations to the given Dexie database instance.
   * This should be called in the database constructor, before the DB is opened.
   *
   * Internally, this iterates over the MigrationRegistry and calls:
   *   `db.version(N).stores(migration.stores).upgrade(migration.upgrade)`
   *
   * @returns Array of MigrationResult describing the outcome of each migration.
   */
  static applyAll(db: Dexie): MigrationResult[] {
    const migrations = MigrationRegistry.getAll()
    const results: MigrationResult[] = []

    // Validate sequence integrity before applying
    MigrationRegistry.validate()

    if (migrations.length === 0) {
      console.warn('[MigrationRunner] No migrations registered. Database will have no schema.')
      return results
    }

    const lastMigration = migrations[migrations.length - 1]!
    console.log(
      `[MigrationRunner] Applying ${migrations.length} migration(s) ` +
        `(v1 → v${lastMigration.version})...`,
    )

    for (const migration of migrations) {
      const start = performance.now()

      try {
        this.applyMigration(db, migration)
        const duration = Math.round(performance.now() - start)

        results.push({
          version: migration.version,
          name: migration.name,
          status: 'applied',
          duration,
        })

        console.log(
          `[MigrationRunner] ✓ v${migration.version} "${migration.name}" registered (${duration}ms)`,
        )
      } catch (error) {
        const duration = Math.round(performance.now() - start)
        const errorMessage = error instanceof Error ? error.message : String(error)

        results.push({
          version: migration.version,
          name: migration.name,
          status: 'failed',
          error: errorMessage,
          duration,
        })

        console.error(
          `[MigrationRunner] ✗ v${migration.version} "${migration.name}" FAILED:`,
          errorMessage,
        )

        // Re-throw so Dexie can handle the error during open()
        throw error
      }
    }

    console.log(
      `[MigrationRunner] All ${results.length} migration(s) registered successfully.`,
    )

    return results
  }

  /**
   * Applies a single migration to the Dexie instance.
   */
  private static applyMigration(db: Dexie, migration: DexieMigration): void {
    const version = db.version(migration.version).stores(migration.stores)

    if (migration.upgrade) {
      version.upgrade(migration.upgrade)
    }
  }
}
