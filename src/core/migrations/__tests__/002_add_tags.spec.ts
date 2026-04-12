import { describe, it, expect, beforeEach } from 'vitest'
import Dexie from 'dexie'
import { MigrationRegistry } from '../MigrationRegistry'
import { MigrationRunner } from '../MigrationRunner'
import { migration001InitialSchema } from '../dexie/001_initial_schema'
import { migration002AddTagsToTransactions } from '../dexie/002_add_tags_to_transactions'

describe('Migration 002 - Add Tags to Transactions', () => {
  beforeEach(() => {
    MigrationRegistry.clear()
  })

  it('should define version 2', () => {
    expect(migration002AddTagsToTransactions.version).toBe(2)
  })

  it('should add *tags index to transactions store', () => {
    const stores = migration002AddTagsToTransactions.stores
    expect(stores.transactions).toContain('*tags')
  })

  it('should preserve all other tables unchanged', () => {
    const stores002 = migration002AddTagsToTransactions.stores
    const stores001 = migration001InitialSchema.stores

    // All non-transactions tables should be identical
    const otherTables = Object.keys(stores001).filter((t) => t !== 'transactions')
    for (const table of otherTables) {
      expect(stores002[table]).toEqual(stores001[table])
    }
  })

  it('should have upgrade function defined', () => {
    expect(migration002AddTagsToTransactions.upgrade).toBeDefined()
    expect(typeof migration002AddTagsToTransactions.upgrade).toBe('function')
  })

  it('should have downgrade function defined', () => {
    expect(migration002AddTagsToTransactions.downgrade).toBeDefined()
    expect(typeof migration002AddTagsToTransactions.downgrade).toBe('function')
  })

  it('upgrade should add tags:[] to existing transactions', async () => {
    // Setup DB with v1 schema and seed test data
    MigrationRegistry.register(migration001InitialSchema)
    const db = new Dexie('TestDB_002_upgrade')
    MigrationRunner.applyAll(db)
    await db.open()

    // Insert a transaction without tags
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
    MigrationRegistry.register(migration002AddTagsToTransactions)
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
    MigrationRegistry.register(migration002AddTagsToTransactions)

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
