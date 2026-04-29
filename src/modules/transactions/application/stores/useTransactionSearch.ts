import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'

type UITransaction = any

/**
 * Composable for ITransaction search functionality.
 * Separates search concerns from main ITransaction store (SRP).
 */
export function useTransactionSearch(
  activetransactions: ComputedRef<UITransaction[]>,
  categoryMap: Ref<Record<string, ICategory>> | ComputedRef<Record<string, ICategory>>,
) {
  const searchQuery = ref('')

  const filteredtransactions = computed(() => {
    if (!searchQuery.value.trim()) return activetransactions.value

    const query = searchQuery.value.toLowerCase().trim()
    const filteredResults: UITransaction[] = []
    const sourcetransactions = activetransactions.value
    const categoryLookup = categoryMap.value

    for (let i = 0, len = sourcetransactions.length; i < len; i++) {
      const ITransaction = sourcetransactions[i]!
      if (ITransaction._titleLower.includes(query)) {
        filteredResults.push(ITransaction)
        continue
      }

      const category = categoryLookup[ITransaction.category_id]
      if (category && category.name.toLowerCase().includes(query)) {
        filteredResults.push(ITransaction)
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
    filteredtransactions,
    setSearchQuery,
    clearSearch,
  }
}
