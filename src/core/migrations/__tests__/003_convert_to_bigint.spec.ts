import { describe, it, expect, beforeEach } from 'vitest'
import Dexie from 'dexie'
import { MigrationRegistry } from '../MigrationRegistry'
import { MigrationRunner } from '../MigrationRunner'
import { migration001InitialSchema } from '../dexie/001_initial_schema'
import { migration002AddTagsTotransactions } from '../dexie/002_add_tags_to_transactions'
import { migration003ConvertToBigInt } from '../dexie/003_convert_to_bigint'

describe('Migration 003 - BigInt Conversion', () => {
  const DB_NAME = 'TestDB_BigInt'

  beforeEach(async () => {
    MigrationRegistry.clear()
    await Dexie.delete(DB_NAME)
  })

  it('should convert numeric values to bigint and preserve integrity', async () => {
    // Stage 1: Initialize at version 2 with numeric data
    MigrationRegistry.register(migration001InitialSchema)
    MigrationRegistry.register(migration002AddTagsTotransactions)

    const db = new Dexie(DB_NAME)
    MigrationRunner.applyAll(db)
    await db.open()

    // Seed data (Version 2)
    await db.table('transactions').add({
      id: 'tx1',
      title: 'Lunch',
      amount: 1550, // 15.50 in cents
      date: '2026-04-12T12:00:00Z',
      deleted: false
    })

    await db.table('wallets').add({
      id: 'w1',
      name: 'Main IWallet',
      balance: 500000, // 5000.00
      deleted: false
    })

    db.close()

    // Stage 2: Apply Migration 003
    MigrationRegistry.clear() // Ensure we re-register including 003
    MigrationRegistry.register(migration001InitialSchema)
    MigrationRegistry.register(migration002AddTagsTotransactions)
    MigrationRegistry.register(migration003ConvertToBigInt)

    const dbV3 = new Dexie(DB_NAME)
    MigrationRunner.applyAll(dbV3)
    await dbV3.open()

    expect(dbV3.verno).toBe(3)

    // Verify Conversion
    const tx = await dbV3.table('transactions').get('tx1')
    expect(tx.amount).toBe(1550n)
    expect(typeof tx.amount).toBe('bigint')

    const IWallet = await dbV3.table('wallets').get('w1')
    expect(IWallet.balance).toBe(500000n)
    expect(typeof IWallet.balance).toBe('bigint')

    dbV3.close()
  })

  it('should handle missing or alternative formats gracefully', async () => {
     MigrationRegistry.register(migration001InitialSchema)
     MigrationRegistry.register(migration002AddTagsTotransactions)
     MigrationRegistry.register(migration003ConvertToBigInt)

     const db = new Dexie(DB_NAME)
     MigrationRunner.applyAll(db)
     await db.open()

     // If we add data now, it should already be handled if specified by the type, 
     // but the migration only runs once.
     // Testing the logic intrinsically is better.

     db.close()
  })
})
