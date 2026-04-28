/**
 * Mock factory for IndexedDB/Dexie
 * Provides mock implementations for Dexie database operations
 */

import { vi } from 'vitest'
import type Dexie from 'dexie'

export interface MockDexieTable<T = unknown> {
  add: ReturnType<typeof vi.fn>
  bulkAdd: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  bulkPut: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
  bulkDelete: ReturnType<typeof vi.fn>
  get: ReturnType<typeof vi.fn>
  where: ReturnType<typeof vi.fn>
  filter: ReturnType<typeof vi.fn>
  toArray: ReturnType<typeof vi.fn>
  count: ReturnType<typeof vi.fn>
  orderBy: ReturnType<typeof vi.fn>
  limit: ReturnType<typeof vi.fn>
  offset: ReturnType<typeof vi.fn>
  first: ReturnType<typeof vi.fn>
  last: ReturnType<typeof vi.fn>
  each: ReturnType<typeof vi.fn>
  toCollection: ReturnType<typeof vi.fn>
  and: ReturnType<typeof vi.fn>
  or: ReturnType<typeof vi.fn>
  equals: ReturnType<typeof vi.fn>
  above: ReturnType<typeof vi.fn>
  aboveOrEqual: ReturnType<typeof vi.fn>
  below: ReturnType<typeof vi.fn>
  belowOrEqual: ReturnType<typeof vi.fn>
  between: ReturnType<typeof vi.fn>
  startsWith: ReturnType<typeof vi.fn>
  startsWithIgnoreCase: ReturnType<typeof vi.fn>
  anyOf: ReturnType<typeof vi.fn>
  noneOf: ReturnType<typeof vi.fn>
  inAnyRange: ReturnType<typeof vi.fn>
  reverse: ReturnType<typeof vi.fn>
  sortBy: ReturnType<typeof vi.fn>
  distinct: ReturnType<typeof vi.fn>
  until: ReturnType<typeof vi.fn>
  modify: ReturnType<typeof vi.fn>
  primaryKeys: ReturnType<typeof vi.fn>
  keys: ReturnType<typeof vi.fn>
  uniqueKeys: ReturnType<typeof vi.fn>
}

export function createMockDexieTable<T = unknown>(
  tableName: string,
  initialData: T[] = []
): MockDexieTable<T> {
  let data = [...initialData]

  const mockWhere = vi.fn().mockReturnValue({
    equals: vi.fn().mockReturnThis(),
    above: vi.fn().mockReturnThis(),
    aboveOrEqual: vi.fn().mockReturnThis(),
    below: vi.fn().mockReturnThis(),
    belowOrEqual: vi.fn().mockReturnThis(),
    between: vi.fn().mockReturnThis(),
    startsWith: vi.fn().mockReturnThis(),
    startsWithIgnoreCase: vi.fn().mockReturnThis(),
    anyOf: vi.fn().mockReturnThis(),
    noneOf: vi.fn().mockReturnThis(),
    inAnyRange: vi.fn().mockReturnThis(),
    and: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    sortBy: vi.fn().mockReturnThis(),
    reverse: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    distinct: vi.fn().mockReturnThis(),
    until: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(data[0] ?? null),
    last: vi.fn().mockResolvedValue(data[data.length - 1] ?? null),
    toArray: vi.fn().mockResolvedValue(data),
    count: vi.fn().mockResolvedValue(data.length),
    modify: vi.fn().mockResolvedValue(data.length),
    delete: vi.fn().mockResolvedValue(data.length),
    primaryKeys: vi.fn().mockResolvedValue(data.map((item: T & { id?: string }) => item.id)),
    keys: vi.fn().mockResolvedValue(data.map((item: T & { id?: string }) => item.id)),
    uniqueKeys: vi.fn().mockResolvedValue([...new Set(data.map((item: T & { id?: string }) => item.id))]),
  })

  return {
    add: vi.fn().mockImplementation((item: T & { id?: string }) => {
      data.push(item)
      return Promise.resolve(item.id ?? data.length)
    }),
    bulkAdd: vi.fn().mockImplementation((items: Array<T & { id?: string }>) => {
      const ids = items.map((item) => item.id ?? crypto.randomUUID())
      data.push(...items)
      return Promise.resolve(ids)
    }),
    put: vi.fn().mockImplementation((item: T & { id?: string }) => {
      const index = data.findIndex((d: T & { id?: string }) => d.id === item.id)
      if (index >= 0) {
        data[index] = item
      } else {
        data.push(item)
      }
      return Promise.resolve(item.id ?? data.length)
    }),
    bulkPut: vi.fn().mockImplementation((items: Array<T & { id?: string }>) => {
      items.forEach((item) => {
        const index = data.findIndex((d: T & { id?: string }) => d.id === item.id)
        if (index >= 0) {
          data[index] = item
        } else {
          data.push(item)
        }
      })
      return Promise.resolve(items.map((item) => item.id))
    }),
    update: vi.fn().mockImplementation((id: string, changes: Partial<T>) => {
      const index = data.findIndex((d: T & { id?: string }) => d.id === id)
      if (index >= 0) {
        data[index] = { ...data[index], ...changes }
        return Promise.resolve(1)
      }
      return Promise.resolve(0)
    }),
    delete: vi.fn().mockImplementation((id: string) => {
      const index = data.findIndex((d: T & { id?: string }) => d.id === id)
      if (index >= 0) {
        data.splice(index, 1)
        return Promise.resolve()
      }
      return Promise.resolve()
    }),
    bulkDelete: vi.fn().mockImplementation((ids: string[]) => {
      data = data.filter((d: T & { id?: string }) => !ids.includes(d.id ?? ''))
      return Promise.resolve()
    }),
    get: vi.fn().mockImplementation((id: string) => {
      return Promise.resolve(data.find((d: T & { id?: string }) => d.id === id) ?? null)
    }),
    where: mockWhere,
    filter: vi.fn().mockReturnThis(),
    toArray: vi.fn().mockResolvedValue(data),
    count: vi.fn().mockResolvedValue(data.length),
    orderBy: vi.fn().mockReturnValue({
      reverse: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue(data),
      first: vi.fn().mockResolvedValue(data[0] ?? null),
      last: vi.fn().mockResolvedValue(data[data.length - 1] ?? null),
    }),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(data[0] ?? null),
    last: vi.fn().mockResolvedValue(data[data.length - 1] ?? null),
    each: vi.fn().mockResolvedValue(undefined),
    toCollection: vi.fn().mockReturnThis(),
    and: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    equals: vi.fn().mockReturnThis(),
    above: vi.fn().mockReturnThis(),
    aboveOrEqual: vi.fn().mockReturnThis(),
    below: vi.fn().mockReturnThis(),
    belowOrEqual: vi.fn().mockReturnThis(),
    between: vi.fn().mockReturnThis(),
    startsWith: vi.fn().mockReturnThis(),
    startsWithIgnoreCase: vi.fn().mockReturnThis(),
    anyOf: vi.fn().mockReturnThis(),
    noneOf: vi.fn().mockReturnThis(),
    inAnyRange: vi.fn().mockReturnThis(),
    reverse: vi.fn().mockReturnThis(),
    sortBy: vi.fn().mockReturnThis(),
    distinct: vi.fn().mockReturnThis(),
    until: vi.fn().mockReturnThis(),
    modify: vi.fn().mockResolvedValue(data.length),
    primaryKeys: vi.fn().mockResolvedValue(data.map((item: T & { id?: string }) => item.id)),
    keys: vi.fn().mockResolvedValue(data.map((item: T & { id?: string }) => item.id)),
    uniqueKeys: vi.fn().mockResolvedValue([...new Set(data.map((item: T & { id?: string }) => item.id))]),
  }
}

export function createMockDexie( tables: Record<string, unknown[]> = {}) {
  const mockTables: Record<string, MockDexieTable> = {}

  Object.entries(tables).forEach(([name, data]) => {
    mockTables[name] = createMockDexieTable(name, data)
  })

  const mockDexie = {
    ...mockTables,
    table: vi.fn().mockImplementation((name: string) => {
      if (!mockTables[name]) {
        mockTables[name] = createMockDexieTable(name)
      }
      return mockTables[name]
    }),
    tables: vi.fn().mockReturnValue(Object.values(mockTables)),
    transaction: vi.fn().mockImplementation((mode: string, ...args: unknown[]) => {
      const callback = args[args.length - 1] as Function
      return Promise.resolve(callback())
    }),
    open: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
    isOpen: vi.fn().mockReturnValue(true),
    version: vi.fn().mockReturnValue({
      stores: vi.fn().mockReturnThis(),
      upgrade: vi.fn().mockReturnThis(),
    }),
    on: {
      ready: { subscribe: vi.fn() },
      error: { subscribe: vi.fn() },
    },
    use: vi.fn(),
  } as unknown as Dexie

  return {
    db: mockDexie,
    tables: mockTables,
    resetMocks: () => {
      Object.values(mockTables).forEach((table) => {
        table.add.mockClear()
        table.get.mockClear()
        table.put.mockClear()
        table.update.mockClear()
        table.delete.mockClear()
        table.where.mockClear()
        table.toArray.mockClear()
        table.count.mockClear()
      })
    },
  }
}

export function createMockEntity<T extends object>(
  defaults: T,
  overrides: Partial<T> = {}
): T {
  return {
    ...defaults,
    ...overrides,
  }
}
