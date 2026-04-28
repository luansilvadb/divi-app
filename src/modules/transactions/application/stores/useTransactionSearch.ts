import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'

type UITransaction = Transaction & { _titleLower: string; _timestamp: number; _dateKey: string }

/**
 * Composable for transaction search functionality.
 * Separates search concerns from main transaction store (SRP).
 */
export function useTransactionSearch(
  activeTransactions: ComputedRef<UITransaction[]>,
  categoryMap: Ref<Record<string, Category>> | ComputedRef<Record<string, Category>>,
) {
  const searchQuery = ref('')

  const filteredTransactions = computed(() => {
    if (!searchQuery.value.trim()) return activeTransactions.value

    const query = searchQuery.value.toLowerCase().trim()
    const filteredResults: UITransaction[] = []
    const sourceTransactions = activeTransactions.value
    const categoryLookup = categoryMap.value

    for (let i = 0, len = sourceTransactions.length; i < len; i++) {
      const transaction = sourceTransactions[i]!
      if (transaction._titleLower.includes(query)) {
        filteredResults.push(transaction)
        continue
      }

      const category = categoryLookup[transaction.category_id]
      if (category && category.name.toLowerCase().includes(query)) {
        filteredResults.push(transaction)
      }
    }

    return filteredResults
  })

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    filteredTransactions,
    setSearchQuery,
    clearSearch,
  }
}
