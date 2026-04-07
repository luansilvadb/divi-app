import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DiviDatabase } from '../DexieDB'
import Dexie from 'dexie'
import { indexedDB, IDBKeyRange } from 'fake-indexeddb'

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange

describe('DiviDatabase', () => {
  let db: DiviDatabase

  beforeEach(() => {
    db = new DiviDatabase('TestDB')
  })

  afterEach(async () => {
    await db.delete()
  })

  it('should initialize the database with correct stores', () => {
    expect(db.name).toBe('TestDB')
    expect(db.tables.map(t => t.name)).toContain('transactions')
  })

  it('should have the correct schema for transactions', async () => {
    const table = db.table('transactions')
    expect(table.schema.primKey.name).toBe('id')
    expect(table.schema.indexes.map(idx => idx.name)).toContain('date')
    expect(table.schema.indexes.map(idx => idx.name)).toContain('syncStatus')
  })
})
