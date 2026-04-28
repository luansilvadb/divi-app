import { describe, it, expect, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { useTransactionSearch } from '../useTransactionSearch'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'

type UITransaction = Transaction & { _titleLower: string; _timestamp: number; _dateKey: string }

/**
 * Performance tests for useTransactionSearch composable
 * Validates O(n) search performance on large datasets
 */
describe('useTransactionSearch Performance', () => {
  let mockTransactions: UITransaction[] = []
  let mockCategoryMap: Record<string, Category>

  beforeEach(() => {
    // Generate large dataset for performance testing (10,000 transactions)
    mockTransactions = Array.from({ length: 10000 }, (_, i) => ({
      id: `tx-${i}`,
      title: `Transaction ${i} - ${['Grocery', 'Salary', 'Rent', 'Utilities'][i % 4]}`,
      _titleLower: `transaction ${i} - ${['grocery', 'salary', 'rent', 'utilities'][i % 4]}`,
      amount: BigInt(1000 * (i % 100)),
      type: i % 2 === 0 ? ('income' as const) : ('expense' as const),
      category_id: `cat-${i % 10}`,
      wallet_id: `wallet-${i % 5}`,
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
        { id: `cat-${i}`, name: `Category ${i}`, icon: 'icon', color: '#000', sync_status: 'synced', deleted: false, user_id: 'user-1', version: 1, created_at: '', client_updated_at: '' } as Category
      ])
    )
  })

  it('should search 10,000 transactions in less than 50ms', () => {
    const activeTransactions = computed(() => mockTransactions)
    const categoryMap = computed(() => mockCategoryMap)
    const { setSearchQuery, filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)

    // Warm up
    setSearchQuery('grocery')
    filteredTransactions.value

    // Measure performance
    const start = performance.now()
    setSearchQuery('salary')
    const results = filteredTransactions.value
    const end = performance.now()

    const duration = end - start

    // Assertions
    expect(duration).toBeLessThan(50)
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(r => r._titleLower.includes('salary'))).toBe(true)

    console.log(`[Performance] Search 10,000 transactions: ${duration.toFixed(2)}ms`)
  })

  it('should search by category name in less than 50ms', () => {
    const activeTransactions = computed(() => mockTransactions)
    const categoryMap = computed(() => mockCategoryMap)
    const { setSearchQuery, filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)

    // Warm up
    setSearchQuery('Category 5')
    filteredTransactions.value

    // Measure performance
    const start = performance.now()
    setSearchQuery('Category 3')
    const results = filteredTransactions.value
    const end = performance.now()

    const duration = end - start

    expect(duration).toBeLessThan(50)
    expect(results.length).toBeGreaterThan(0)

    console.log(`[Performance] Category search 10,000 transactions: ${duration.toFixed(2)}ms`)
  })

  it('should handle empty search efficiently', () => {
    const activeTransactions = computed(() => mockTransactions)
    const categoryMap = computed(() => mockCategoryMap)
    const { searchQuery, filteredTransactions } = useTransactionSearch(activeTransactions, categoryMap)

    const start = performance.now()
    // Empty search should return all transactions without filtering
    const results = filteredTransactions.value
    const end = performance.now()

    const duration = end - start

    expect(duration).toBeLessThan(5) // Should be nearly instant
    expect(results.length).toBe(10000)

    console.log(`[Performance] Empty search (passthrough): ${duration.toFixed(2)}ms`)
  })
})
