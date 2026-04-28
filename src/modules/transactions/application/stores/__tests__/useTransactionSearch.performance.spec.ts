import { describe, it, expect, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { usetransactionsearch } from '../usetransactionsearch'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'

type UITransaction = any

/**
 * Performance tests for usetransactionsearch composable
 * Validates O(n) search performance on large datasets
 */
describe('usetransactionsearch Performance', () => {
  let mocktransactions: UITransaction[] = []
  let mockCategoryMap: Record<string, ICategory>

  beforeEach(() => {
    // Generate large dataset for performance testing (10,000 transactions)
    mocktransactions = Array.from({ length: 10000 }, (_, i) => ({
      id: `tx-${i}`,
      title: `ITransaction ${i} - ${['Grocery', 'Salary', 'Rent', 'Utilities'][i % 4]}`,
      _titleLower: `ITransaction ${i} - ${['grocery', 'salary', 'rent', 'utilities'][i % 4]}`,
      amount: BigInt(1000 * (i % 100)),
      type: i % 2 === 0 ? ('income' as const) : ('expense' as const),
      category_id: `cat-${i % 10}`,
      wallet_id: `IWallet-${i % 5}`,
      date: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
      _timestamp: Date.now() - i * 1000,
      _dateKey: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
      sync_status: 'synced' as const,
      deleted: false,
      user_id: 'user-1',
      version: 1,
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
    }))

    mockCategoryMap = Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [
        `cat-${i}`,
        { id: `cat-${i}`, name: `ICategory ${i}`, icon: 'icon', color: '#000', sync_status: 'synced', deleted: false, user_id: 'user-1', version: 1, created_at: '', client_updated_at: '' } as ICategory
      ])
    )
  })

  it('should search 10,000 transactions in less than 50ms', () => {
    const activetransactions = computed(() => mocktransactions)
    const categoryMap = computed(() => mockCategoryMap)
    const { setSearchQuery, filteredtransactions } = usetransactionsearch(activetransactions, categoryMap)

    // Warm up
    setSearchQuery('grocery')
    filteredtransactions.value

    // Measure performance
    const start = performance.now()
    setSearchQuery('salary')
    const results = filteredtransactions.value
    const end = performance.now()

    const duration = end - start

    // Assertions
    expect(duration).toBeLessThan(50)
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(r => r._titleLower.includes('salary'))).toBe(true)

    console.log(`[Performance] Search 10,000 transactions: ${duration.toFixed(2)}ms`)
  })

  it('should search by category name in less than 50ms', () => {
    const activetransactions = computed(() => mocktransactions)
    const categoryMap = computed(() => mockCategoryMap)
    const { setSearchQuery, filteredtransactions } = usetransactionsearch(activetransactions, categoryMap)

    // Warm up
    setSearchQuery('ICategory 5')
    filteredtransactions.value

    // Measure performance
    const start = performance.now()
    setSearchQuery('ICategory 3')
    const results = filteredtransactions.value
    const end = performance.now()

    const duration = end - start

    expect(duration).toBeLessThan(50)
    expect(results.length).toBeGreaterThan(0)

    console.log(`[Performance] ICategory search 10,000 transactions: ${duration.toFixed(2)}ms`)
  })

  it('should handle empty search efficiently', () => {
    const activetransactions = computed(() => mocktransactions)
    const categoryMap = computed(() => mockCategoryMap)
    const { searchQuery, filteredtransactions } = usetransactionsearch(activetransactions, categoryMap)

    const start = performance.now()
    // Empty search should return all transactions without filtering
    const results = filteredtransactions.value
    const end = performance.now()

    const duration = end - start

    expect(duration).toBeLessThan(5) // Should be nearly instant
    expect(results.length).toBe(10000)

    console.log(`[Performance] Empty search (passthrough): ${duration.toFixed(2)}ms`)
  })
})
