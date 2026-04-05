/**
 * Search history manager for transaction search.
 * Stores recent searches in localStorage.
 */

const SEARCH_HISTORY_KEY = 'divi-transaction-search-history'
const MAX_HISTORY = 10

export function getSearchHistory(): string[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addToSearchHistory(query: string): void {
  if (!query || query.trim().length < 2) return

  const history = getSearchHistory()
  const normalizedQuery = query.trim()

  // Remove if already exists (to move to top)
  const filtered = history.filter((q) => q.toLowerCase() !== normalizedQuery.toLowerCase())

  // Add to beginning
  const updated = [normalizedQuery, ...filtered].slice(0, MAX_HISTORY)

  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  } catch {
    // Silently fail
  }
}
