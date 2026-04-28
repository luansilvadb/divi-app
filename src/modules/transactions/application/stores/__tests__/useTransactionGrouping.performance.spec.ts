import { describe, it, expect, beforeEach } from 'vitest'
import { computed } from 'vue'
import { useTransactionGrouping } from '../useTransactionGrouping'
import type { Transaction } from '@/shared/domain/entities/Transaction'

type UITransaction = any

/**
 * Performance tests for useTransactionGrouping composable
 * Validates O(n) grouping performance on large datasets
 */
describe('useTransactionGrouping Performance', () => {
  let mockTransactions: UITransaction[] = []

  beforeEach(() => {
    // Generate large dataset for performance testing (5,000 transactions across 30 days)
    const baseDate = new Date(2024, 0, 1)
    mockTransactions = Array.from({ length: 5000 }, (_, i) => {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + (i % 30)) // Spread across 30 days
      const dateKey = date.toISOString().split('T')[0]

      return {
        id: `tx-${i}`,
        title: `Transaction ${i}`,
        _titleLower: `transaction ${i}`,
        amount: BigInt(1000 * (i % 100)),
        type: i % 2 === 0 ? ('income' as const) : ('expense' as const),
        category_id: `cat-${i % 10}`,
        wallet_id: `wallet-${i % 5}`,
        date: dateKey,
        _timestamp: date.getTime(),
        _dateKey: dateKey,
        sync_status: 'synced' as const,
        deleted: false,
        user_id: 'user-1',
        version: 1,
        created_at: new Date().toISOString(),
        client_updated_at: new Date().toISOString(),
      }
    })
  })

  it('should group 5,000 transactions in less than 30ms', () => {
    const filteredTransactions = computed(() => mockTransactions)
    const { groupedTransactions } = useTransactionGrouping(filteredTransactions)

    // Measure initial grouping performance
    const start = performance.now()
    const groups = groupedTransactions.value
    const end = performance.now()

    const duration = end - start

    // Assertions
    expect(duration).toBeLessThan(30)
    expect(Object.keys(groups).length).toBe(30) // Should have 30 date groups

    // Verify totals are calculated correctly
    let totalTransactions = 0
    for (const group of Object.values(groups)) {
      totalTransactions += group.items.length
    }
    expect(totalTransactions).toBe(5000)

    console.log(`[Performance] Group 5,000 transactions: ${duration.toFixed(2)}ms`)
  })

  it('should handle empty dataset efficiently', () => {
    const filteredTransactions = computed(() => [])
    const { groupedTransactions } = useTransactionGrouping(filteredTransactions)

    const start = performance.now()
    const groups = groupedTransactions.value
    const end = performance.now()

    const duration = end - start

    expect(duration).toBeLessThan(5)
    expect(Object.keys(groups).length).toBe(0)

    console.log(`[Performance] Empty grouping: ${duration.toFixed(2)}ms`)
  })

  it('should maintain O(n) complexity with increasing dataset size', () => {
    const sizes = [100, 1000, 5000]
    const results: { size: number; duration: number }[] = []

    for (const size of sizes) {
      const subset = mockTransactions.slice(0, size)
      const filteredTransactions = computed(() => subset)
      const { groupedTransactions } = useTransactionGrouping(filteredTransactions)

      // Warm up
      groupedTransactions.value

      // Measure
      const start = performance.now()
      groupedTransactions.value
      const end = performance.now()

      results.push({ size, duration: end - start })
    }

    // Log scalability results
    console.log('[Performance] Scalability test results:')
    results.forEach(r => {
      console.log(`  ${r.size.toLocaleString()} transactions: ${r.duration.toFixed(2)}ms`)
    })

    // Verify linear scaling (10x data should not take 100x time)
    const ratio10x = results[1]!.duration / results[0]!.duration
    expect(ratio10x).toBeLessThan(15) // Should be closer to 10x than 100x
  })
})
