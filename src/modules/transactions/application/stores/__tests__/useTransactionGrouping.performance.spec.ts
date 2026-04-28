import { describe, it, expect, beforeEach } from 'vitest'
import { computed } from 'vue'
import { useITransactionGrouping } from '../useITransactionGrouping'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'

type UITransaction = any

/**
 * Performance tests for useITransactionGrouping composable
 * Validates O(n) grouping performance on large datasets
 */
describe('useITransactionGrouping Performance', () => {
  let mocktransactions: UITransaction[] = []

  beforeEach(() => {
    // Generate large dataset for performance testing (5,000 transactions across 30 days)
    const baseDate = new Date(2024, 0, 1)
    mocktransactions = Array.from({ length: 5000 }, (_, i) => {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + (i % 30)) // Spread across 30 days
      const dateKey = date.toISOString().split('T')[0]

      return {
        id: `tx-${i}`,
        title: `ITransaction ${i}`,
        _titleLower: `ITransaction ${i}`,
        amount: BigInt(1000 * (i % 100)),
        type: i % 2 === 0 ? ('income' as const) : ('expense' as const),
        category_id: `cat-${i % 10}`,
        wallet_id: `IWallet-${i % 5}`,
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
    const filteredtransactions = computed(() => mocktransactions)
    const { groupedtransactions } = useITransactionGrouping(filteredtransactions)

    // Measure initial grouping performance
    const start = performance.now()
    const groups = groupedtransactions.value
    const end = performance.now()

    const duration = end - start

    // Assertions
    expect(duration).toBeLessThan(30)
    expect(Object.keys(groups).length).toBe(30) // Should have 30 date groups

    // Verify totals are calculated correctly
    let totaltransactions = 0
    for (const group of Object.values(groups)) {
      totaltransactions += group.items.length
    }
    expect(totaltransactions).toBe(5000)

    console.log(`[Performance] Group 5,000 transactions: ${duration.toFixed(2)}ms`)
  })

  it('should handle empty dataset efficiently', () => {
    const filteredtransactions = computed(() => [])
    const { groupedtransactions } = useITransactionGrouping(filteredtransactions)

    const start = performance.now()
    const groups = groupedtransactions.value
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
      const subset = mocktransactions.slice(0, size)
      const filteredtransactions = computed(() => subset)
      const { groupedtransactions } = useITransactionGrouping(filteredtransactions)

      // Warm up
      groupedtransactions.value

      // Measure
      const start = performance.now()
      groupedtransactions.value
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
