import { describe, it, expect, beforeEach } from 'vitest'
import Dexie from 'dexie'
import { MigrationRegistry } from '../MigrationRegistry'
import { MigrationRunner } from '../MigrationRunner'
import { migration001InitialSchema } from '../dexie/001_initial_schema'
import { migration002AddTagsTotransactions } from '../dexie/002_add_tags_to_transactions'

describe('Migration 002 - Add Tags to transactions', () => {
  beforeEach(() => {
    MigrationRegistry.clear()
  })

  it('should define version 2', () => {
    expect(migration002AddTagsTotransactions.version).toBe(2)
  })

  it('should add *tags index to transactions store', () => {
    const stores = migration002AddTagsTotransactions.stores
    expect(stores.transactions).toContain('*tags')
  })

  it('should preserve all other tables unchanged', () => {
    const stores002 = migration002AddTagsTotransactions.stores
    const stores001 = migration001InitialSchema.stores

    // All non-transactions tables should be identical
    const otherTables = Object.keys(stores001).filter((t) => t !== 'transactions')
    for (const table of otherTables) {
      expect(stores002[table]).toEqual(stores001[table])
    }
  })

  it('should have upgrade function defined', () => {
    expect(migration002AddTagsTotransactions.upgrade).toBeDefined()
    expect(typeof migration002AddTagsTotransactions.upgrade).toBe('function')
  })

  it('upgrade should add tags:[] to existing transactions', async () => {
    // Setup DB with v1 schema and seed test data
    MigrationRegistry.register(migration001InitialSchema)
    const db = new Dexie('TestDB_002_upgrade')
    MigrationRunner.applyAll(db)
    await db.open()

    // Insert a ITransaction without tags
    await db.table('transactions').add({
      id: 'tx-1',
      user_id: 'user-1',
      title: 'Test',
      amount: 100,
      type: 'expense',
      category_id: 'cat-1',
      wallet_id: 'wal-1',
      date: '2026-01-01',
      sync_status: 'pending',
      client_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    })

    db.close()

    // Now open with v2 (which includes upgrade)
    MigrationRegistry.clear()
    MigrationRegistry.register(migration001InitialSchema)
    MigrationRegistry.register(migration002AddTagsTotransactions)
    const db2 = new Dexie('TestDB_002_upgrade')
    MigrationRunner.applyAll(db2)
    await db2.open()

    const tx = await db2.table('transactions').get('tx-1')
    expect(tx).toBeDefined()
    expect(tx.tags).toEqual([])

    db2.close()
    await Dexie.delete('TestDB_002_upgrade')
  })

  it('should create schema with tags index via MigrationRunner', async () => {
    MigrationRegistry.register(migration001InitialSchema)
    MigrationRegistry.register(migration002AddTagsTotransactions)

    const db = new Dexie('TestDB_002_schema')
    MigrationRunner.applyAll(db)
    await db.open()

    // Verify the tags index exists
    const txTable = db.table('transactions')
    const indexNames = txTable.schema.indexes.map((i) => i.name)
    expect(indexNames).toContain('tags')

    db.close()
    await Dexie.delete('TestDB_002_schema')
  })
})
