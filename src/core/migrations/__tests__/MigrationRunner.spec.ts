import { describe, it, expect, beforeEach, vi } from 'vitest'
import type Dexie from 'dexie'
import { MigrationRunner } from '../MigrationRunner'
import { MigrationRegistry } from '../MigrationRegistry'
import type { DexieMigration } from '../types'

type UpgradeFn = (...args: unknown[]) => unknown

/**
 * Creates a mock Dexie instance that tracks version/stores/upgrade calls.
 */
function createMockDexie() {
  const versionCalls: Array<{
    version: number
    stores: Record<string, string | null>
    upgrade?: UpgradeFn
  }> = []

  const mockDexie = {
    version: vi.fn((v: number) => {
      const call: (typeof versionCalls)[0] = { version: v, stores: {} }
      versionCalls.push(call)

      const storesReturn = {
        stores: vi.fn((s: Record<string, string | null>) => {
          call.stores = s
          return {
            upgrade: vi.fn((fn: UpgradeFn) => {
              call.upgrade = fn
            }),
          }
        }),
      }
      return storesReturn
    }),
    _versionCalls: versionCalls,
  }

  return mockDexie
}

function createMigration(overrides: Partial<DexieMigration> = {}): DexieMigration {
  return {
    version: 1,
    name: 'test_migration',
    description: 'Test',
    createdAt: '2026-01-01T00:00:00Z',
    stores: { table: 'id, name' },
    ...overrides,
  }
}

describe('MigrationRunner', () => {
  beforeEach(() => {
    MigrationRegistry.clear()
  })

  it('should apply all registered migrations via db.version().stores()', () => {
    MigrationRegistry.register(
      createMigration({
        version: 1,
        name: 'v1',
        stores: { users: 'id, name' },
      }),
    )
    MigrationRegistry.register(
      createMigration({
        version: 2,
        name: 'v2',
        stores: { users: 'id, name, email' },
      }),
    )

    const db = createMockDexie()
    const results = MigrationRunner.applyAll(db as unknown as Dexie)

    expect(results).toHaveLength(2)
    expect(results[0]!.status).toBe('applied')
    expect(results[1]!.status).toBe('applied')

    expect(db.version).toHaveBeenCalledTimes(2)
    expect(db.version).toHaveBeenCalledWith(1)
    expect(db.version).toHaveBeenCalledWith(2)

    expect(db._versionCalls[0]!.stores).toEqual({ users: 'id, name' })
    expect(db._versionCalls[1]!.stores).toEqual({ users: 'id, name, email' })
  })

  it('should pass upgrade function when provided', () => {
    const upgradeFn = vi.fn()
    MigrationRegistry.register(
      createMigration({
        version: 1,
        stores: { table: 'id' },
        upgrade: upgradeFn,
      }),
    )

    const db = createMockDexie()
    MigrationRunner.applyAll(db as unknown as Dexie)

    expect(db._versionCalls[0]!.upgrade).toBe(upgradeFn)
  })

  it('should not call upgrade when not provided', () => {
    MigrationRegistry.register(
      createMigration({
        version: 1,
        stores: { table: 'id' },
      }),
    )

    const db = createMockDexie()
    MigrationRunner.applyAll(db as unknown as Dexie)

    expect(db._versionCalls[0]!.upgrade).toBeUndefined()
  })

  it('should return empty results when no migrations registered', () => {
    const db = createMockDexie()
    const results = MigrationRunner.applyAll(db as unknown as Dexie)

    expect(results).toEqual([])
    expect(db.version).not.toHaveBeenCalled()
  })

  it('should include duration in results', () => {
    MigrationRegistry.register(createMigration({ version: 1 }))

    const db = createMockDexie()
    const results = MigrationRunner.applyAll(db as unknown as Dexie)

    expect(results[0]!.duration).toBeGreaterThanOrEqual(0)
    expect(typeof results[0]!.duration).toBe('number')
  })

  it('should log migration progress', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    MigrationRegistry.register(createMigration({ version: 1, name: 'initial' }))

    const db = createMockDexie()
    MigrationRunner.applyAll(db as unknown as Dexie)

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Applying 1 migration'))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('v1 "initial"'))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('registered successfully'))

    logSpy.mockRestore()
  })

  it('should re-throw and report failed migrations', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})

    const brokenDb = {
      version: () => {
        throw new Error('DB exploded')
      },
    }

    MigrationRegistry.register(createMigration({ version: 1 }))

    expect(() => {
      MigrationRunner.applyAll(brokenDb as unknown as Dexie)
    }).toThrow('DB exploded')

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('FAILED'),
      expect.stringContaining('DB exploded'),
    )

    errorSpy.mockRestore()
  })
})
