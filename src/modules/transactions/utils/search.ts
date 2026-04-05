/**
 * Transaction search utility with fuzzy matching and multi-field support.
 * Provides case/accent insensitive search across title, category, wallet, and amount.
 */

import type { Transaction } from '@/shared/domain/entities/Transaction'

interface SearchContext {
  transactions: Transaction[]
  categoryMap: Record<string, { name: string }>
  walletMap: Record<string, { name: string }>
}

// Normalize string for search: lowercase + remove accents
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// Simple fuzzy matching: checks if all characters of query appear in order in target
function fuzzyMatch(target: string, query: string): boolean {
  const normalizedTarget = normalizeString(target)
  const normalizedQuery = normalizeString(query)

  let targetIndex = 0
  let queryIndex = 0

  while (targetIndex < normalizedTarget.length && queryIndex < normalizedQuery.length) {
    if (normalizedTarget[targetIndex] === normalizedQuery[queryIndex]) {
      queryIndex++
    }
    targetIndex++
  }

  return queryIndex === normalizedQuery.length
}

/**
 * Search transactions across multiple fields with fuzzy matching.
 * @param query - Search query string
 * @param context - Transactions and lookup maps
 * @returns Array of matching transactions
 */
export function searchTransactions(query: string, context: SearchContext): Transaction[] {
  if (!query || query.trim() === '') {
    return context.transactions
  }

  const normalizedQuery = normalizeString(query.trim())
  const words = normalizedQuery.split(/\s+/).filter(Boolean)

  return context.transactions.filter((t) => {
    const title = t.title || ''
    const category = t.category_id ? context.categoryMap[t.category_id] : undefined
    const wallet = t.wallet_id ? context.walletMap[t.wallet_id] : undefined
    const categoryName = category?.name || ''
    const walletName = wallet?.name || ''
    const amountStr = t.amount.toFixed(2)
    const typeStr = t.type === 'income' ? 'entrada renda' : 'saida despesa gasto'

    // Build searchable text for each field
    const fields = [
      normalizeString(title),
      normalizeString(categoryName),
      normalizeString(walletName),
      normalizeString(amountStr),
      normalizeString(typeStr),
    ]

    // All words must match at least one field (AND logic between words)
    return words.every((word) =>
      fields.some((field) => fuzzyMatch(field, word))
    )
  })
}

/**
 * Get search suggestions based on partial query.
 * Returns matching categories, wallets, and recent transaction titles.
 */
export function getSearchSuggestions(
  query: string,
  context: SearchContext,
  maxSuggestions: number = 8,
): string[] {
  if (!query || query.trim().length < 2) {
    return []
  }

  const normalizedQuery = normalizeString(query.trim())
  const suggestions = new Set<string>()

  // Add matching categories
  for (const cat of Object.values(context.categoryMap)) {
    if (fuzzyMatch(normalizeString(cat.name), normalizedQuery)) {
      suggestions.add(cat.name)
    }
  }

  // Add matching wallets
  for (const wallet of Object.values(context.walletMap)) {
    if (fuzzyMatch(normalizeString(wallet.name), normalizedQuery)) {
      suggestions.add(wallet.name)
    }
  }

  // Add matching transaction titles
  for (const t of context.transactions) {
    if (t.title && fuzzyMatch(normalizeString(t.title), normalizedQuery)) {
      suggestions.add(t.title)
    }
    if (suggestions.size >= maxSuggestions) break
  }

  return Array.from(suggestions).slice(0, maxSuggestions)
}
