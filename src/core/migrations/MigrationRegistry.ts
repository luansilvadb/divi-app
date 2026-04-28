import type { IDexieMigration } from './types'

/**
 * Centralized registry that holds all Dexie migrations in order.
 * Ensures sequential versions without gaps or duplicates.
 */
export class MigrationRegistry {
  private static migrations: IDexieMigration[] = []

  /**
   * Register a migration. Validates for duplicate versions and maintains order.
   * @throws Error if a migration with the same version already exists.
   */
  static register(migration: IDexieMigration): void {
    const existing = this.migrations.find((m) => m.version === migration.version)
    if (existing) {
      throw new Error(
        `[MigrationRegistry] Duplicate migration version ${migration.version}: ` +
          `"${existing.name}" already registered, cannot register "${migration.name}".`,
      )
    }

    this.migrations.push(migration)
    this.migrations.sort((a, b) => a.version - b.version)
  }

  /**
   * Validates that all registered migrations are sequential with no gaps.
   * Should be called before applying migrations (e.g., by MigrationRunner).
   * @throws Error if there is a gap in version numbers.
   */
  static validate(): void {
    this.validateSequence()
  }

  /**
   * Returns all registered migrations, sorted by version.
   */
  static getAll(): ReadonlyArray<IDexieMigration> {
    return [...this.migrations]
  }

  /**
   * Returns migrations within a version range (inclusive).
   */
  static getRange(fromVersion: number, toVersion: number): ReadonlyArray<IDexieMigration> {
    return this.migrations.filter((m) => m.version >= fromVersion && m.version <= toVersion)
  }

  /**
   * Returns the highest registered version, or 0 if none registered.
   */
  static getLatestVersion(): number {
    if (this.migrations.length === 0) return 0
    const last = this.migrations[this.migrations.length - 1]
    return last!.version
  }

  /**
   * Clears all registered migrations. Useful for testing.
   */
  static clear(): void {
    this.migrations = []
  }

  /**
   * Validates that versions are sequential integers starting from 1 with no gaps.
   * @throws Error if there is a gap in version numbers.
   */
  private static validateSequence(): void {
    for (let i = 0; i < this.migrations.length; i++) {
      const migration = this.migrations[i]!
      const expected = i + 1
      const actual = migration.version
      if (actual !== expected) {
        throw new Error(
          `[MigrationRegistry] Version gap detected: expected version ${expected}, ` +
            `but found version ${actual} ("${migration.name}"). ` +
            `Versions must be sequential integers starting from 1.`,
        )
      }
    }
  }
}
