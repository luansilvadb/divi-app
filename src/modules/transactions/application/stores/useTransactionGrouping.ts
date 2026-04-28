import { computed, type ComputedRef } from 'vue'
type UITransaction = any

interface TransactionGroup {
  total: number
  items: UITransaction[]
}

/**
 * Composable for transaction grouping functionality.
 * Groups transactions by date with calculated totals.
 * Separates grouping concerns from main transaction store (SRP).
 */
export function useTransactionGrouping(
  filteredTransactions: ComputedRef<UITransaction[]>,
) {
  const groupedTransactions = computed(() => {
    const groups: Record<string, TransactionGroup> = {}
    const sourceTransactions = filteredTransactions.value

    for (let i = 0, len = sourceTransactions.length; i < len; i++) {
      const transaction = sourceTransactions[i]!
      const dateKey = transaction._dateKey
      if (dateKey) {
        let group = groups[dateKey]
        if (!group) {
          group = { total: 0, items: [] }
          groups[dateKey] = group
        }
        group.items.push(transaction)
        const amountInCurrency = Number(transaction.amount) / 100
        group.total += transaction.type === 'income' ? amountInCurrency : -amountInCurrency
      }
    }

    return groups
  })

  return {
    groupedTransactions,
  }
}
