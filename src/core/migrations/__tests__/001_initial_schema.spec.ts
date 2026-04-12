import { describe, it, expect, beforeEach } from 'vitest'
import Dexie from 'dexie'
import { MigrationRegistry } from '../MigrationRegistry'
import { MigrationRunner } from '../MigrationRunner'
import { migration001InitialSchema } from '../dexie/001_initial_schema'

/**
 * Integration test that verifies the new migration-based schema
 * produces exactly the same result as the original hardcoded schema.
 */
describe('Migration 001 - Schema Equivalence', () => {
  // The exact same stores from the original db.ts hardcoded schema
  const originalStores = {
    transactions: 'id, user_id, date, sync_status, deleted, payee_id',
    wallets: 'id, user_id, name, sync_status, deleted',
    categories: 'id, user_id, name, sync_status, deleted',
    payees: 'id, user_id, name, sync_status, deleted',
    loans: 'id, user_id, name, sync_status, deleted',
    subscriptions: 'id, user_id, name, sync_status, deleted',
    activities: 'id, user_id, timestamp',
    budgets: 'id, user_id, name, sync_status, deleted',
    goals: 'id, user_id, name, sync_status, deleted',
  }

  beforeEach(() => {
    MigrationRegistry.clear()
  })

  it('migration 001 stores should match original hardcoded stores exactly', () => {
    expect(migration001InitialSchema.stores).toEqual(originalStores)
  })

  it('migration 001 should have version 1', () => {
    expect(migration001InitialSchema.version).toBe(1)
  })

  it('migration 001 should have no upgrade function (base schema)', () => {
    expect(migration001InitialSchema.upgrade).toBeUndefined()
  })

  it('should create identical tables via MigrationRunner as the original', async () => {
    // DB1: Original hardcoded approach
    const dbOriginal = new Dexie('TestDB_Original')
    dbOriginal.version(1).stores(originalStores)

    // DB2: Migration-based approach
    MigrationRegistry.register(migration001InitialSchema)
    const dbMigrated = new Dexie('TestDB_Migrated')
    MigrationRunner.applyAll(dbMigrated)

    // Open both databases
    await dbOriginal.open()
    await dbMigrated.open()

    // Compare table names
    const originalTableNames = dbOriginal.tables.map((t) => t.name).sort()
    const migratedTableNames = dbMigrated.tables.map((t) => t.name).sort()
    expect(migratedTableNames).toEqual(originalTableNames)

    // Compare indexes for each table
    for (const tableName of originalTableNames) {
      const origTable = dbOriginal.table(tableName)
      const migrTable = dbMigrated.table(tableName)

      const origIndexes = origTable.schema.indexes.map((i) => i.name).sort()
      const migrIndexes = migrTable.schema.indexes.map((i) => i.name).sort()

      expect(migrIndexes).toEqual(origIndexes)

      // Compare primary key
      expect(migrTable.schema.primKey.name).toEqual(origTable.schema.primKey.name)
    }

    // Cleanup
    dbOriginal.close()
    dbMigrated.close()
    await Dexie.delete('TestDB_Original')
    await Dexie.delete('TestDB_Migrated')
  })

  it('should handle all 9 expected tables', () => {
    const expectedTables = [
      'transactions',
      'wallets',
      'categories',
      'payees',
      'loans',
      'subscriptions',
      'activities',
      'budgets',
      'goals',
    ]

    const migrationTables = Object.keys(migration001InitialSchema.stores)
    expect(migrationTables.sort()).toEqual(expectedTables.sort())
  })
})
