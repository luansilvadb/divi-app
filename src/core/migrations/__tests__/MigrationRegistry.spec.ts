import { describe, it, expect, beforeEach } from 'vitest'
import { MigrationRegistry } from '../MigrationRegistry'
import type { IDexieMigration } from '../types'

function createMigration(overrides: Partial<IDexieMigration> = {}): IDexieMigration {
  return {
    version: 1,
    name: 'test_migration',
    description: 'A test migration',
    createdAt: '2026-01-01T00:00:00Z',
    stores: { test_table: 'id, name' },
    ...overrides,
  }
}

describe('MigrationRegistry', () => {
  beforeEach(() => {
    MigrationRegistry.clear()
  })

  describe('register', () => {
    it('should register a migration successfully', () => {
      const migration = createMigration({ version: 1 })
      MigrationRegistry.register(migration)

      expect(MigrationRegistry.getAll()).toHaveLength(1)
      expect(MigrationRegistry.getAll()[0]).toEqual(migration)
    })

    it('should throw on duplicate version', () => {
      MigrationRegistry.register(createMigration({ version: 1, name: 'first' }))

      expect(() => {
        MigrationRegistry.register(createMigration({ version: 1, name: 'duplicate' }))
      }).toThrow(/Duplicate migration version 1/)
    })

    it('should maintain order when registering out of sequence', () => {
      MigrationRegistry.register(createMigration({ version: 2, name: 'second' }))
      MigrationRegistry.register(createMigration({ version: 1, name: 'first' }))

      const all = MigrationRegistry.getAll()
      expect(all[0]!.version).toBe(1)
      expect(all[1]!.version).toBe(2)
    })

    it('should throw on version gap via validate()', () => {
      MigrationRegistry.register(createMigration({ version: 1, name: 'first' }))
      MigrationRegistry.register(createMigration({ version: 3, name: 'third' }))

      expect(() => {
        MigrationRegistry.validate()
      }).toThrow(/Version gap detected/)
    })
  })

  describe('getAll', () => {
    it('should return empty array when no migrations registered', () => {
      expect(MigrationRegistry.getAll()).toEqual([])
    })

    it('should return a copy (not the internal array)', () => {
      MigrationRegistry.register(createMigration({ version: 1 }))
      const first = MigrationRegistry.getAll()
      const second = MigrationRegistry.getAll()
      expect(first).not.toBe(second)
      expect(first).toEqual(second)
    })
  })

  describe('getRange', () => {
    beforeEach(() => {
      MigrationRegistry.register(createMigration({ version: 1, name: 'v1' }))
      MigrationRegistry.register(createMigration({ version: 2, name: 'v2' }))
      MigrationRegistry.register(createMigration({ version: 3, name: 'v3' }))
    })

    it('should return migrations within inclusive range', () => {
      const range = MigrationRegistry.getRange(1, 2)
      expect(range).toHaveLength(2)
      expect(range[0]!.version).toBe(1)
      expect(range[1]!.version).toBe(2)
    })

    it('should return single migration when from equals to', () => {
      const range = MigrationRegistry.getRange(2, 2)
      expect(range).toHaveLength(1)
      expect(range[0]!.name).toBe('v2')
    })

    it('should return empty array when no migrations in range', () => {
      const range = MigrationRegistry.getRange(10, 20)
      expect(range).toEqual([])
    })
  })

  describe('getLatestVersion', () => {
    it('should return 0 when no migrations', () => {
      expect(MigrationRegistry.getLatestVersion()).toBe(0)
    })

    it('should return highest version', () => {
      MigrationRegistry.register(createMigration({ version: 1 }))
      MigrationRegistry.register(createMigration({ version: 2, name: 'v2' }))
      expect(MigrationRegistry.getLatestVersion()).toBe(2)
    })
  })

  describe('clear', () => {
    it('should remove all registered migrations', () => {
      MigrationRegistry.register(createMigration({ version: 1 }))
      MigrationRegistry.clear()
      expect(MigrationRegistry.getAll()).toEqual([])
    })
  })
})
