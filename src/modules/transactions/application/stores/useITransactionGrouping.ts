import { computed, type ComputedRef } from 'vue'
type UITransaction = any

interface ITransactionGroup {
  total: number
  items: UITransaction[]
}

/**
 * Composable for ITransaction grouping functionality.
 * Groups transactions by date with calculated totals.
 * Separates grouping concerns from main ITransaction store (SRP).
 */
export function useITransactionGrouping(
  filteredtransactions: ComputedRef<UITransaction[]>,
) {
  const groupedtransactions = computed(() => {
    const groups: Record<string, ITransactionGroup> = {}
    const sourcetransactions = filteredtransactions.value

    for (let i = 0, len = sourcetransactions.length; i < len; i++) {
      const ITransaction = sourcetransactions[i]!
      const dateKey = ITransaction._dateKey
      if (dateKey) {
        let group = groups[dateKey]
        if (!group) {
          group = { total: 0, items: [] }
          groups[dateKey] = group
        }
        group.items.push(ITransaction)
        const amountInCurrency = Number(ITransaction.amount) / 100
        group.total += ITransaction.type === 'income' ? amountInCurrency : -amountInCurrency
      }
    }

    return groups
  })

  return {
    groupedtransactions,
  }
}
