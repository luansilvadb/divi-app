import type { ICategory } from '@/modules/categories/core/entities/ICategory'

import type { IAutoCategorizationService } from '../ports/IAutoCategorizationService'

export class AutoCategorizationService implements IAutoCategorizationService {
  // Map for O(1) category lookup by keyword
  private categoryMap = new Map<string, string>([
    ['netflix', 'Entertainment'],
    ['spotify', 'Entertainment'],
    ['uber', 'Transportation'],
    ['ifood', 'Food'],
    ['supermarket', 'Groceries'],
    ['gas', 'Transportation'],
    ['amazon', 'Shopping'],
  ])

  // Cache for category lookups to avoid repeated find() operations
  private categoryCache = new Map<string, ICategory | null>()

  /**
   * Suggests a category based on the ITransaction title
   */
  suggestCategory(title: string, categories: ICategory[]): ICategory | null {
    const lowercaseTitle = title.toLowerCase()

    // Check cache first
    const cacheKey = `${lowercaseTitle}|${categories.length}`
    const cached = this.categoryCache.get(cacheKey)
    if (cached !== undefined) return cached

    // Find matching keyword using Map (more efficient than Object.keys)
    let foundCategoryName: string | null = null
    this.categoryMap.forEach((categoryName, keyword) => {
      if (!foundCategoryName && lowercaseTitle.includes(keyword)) {
        foundCategoryName = categoryName
      }
    })

    if (!foundCategoryName) {
      this.categoryCache.set(cacheKey, null)
      return null
    }

    // Build category name Map for O(1) lookup instead of O(n) find
    const categoryByName = new Map<string, ICategory>()
    for (const cat of categories) {
      categoryByName.set(cat.name.toLowerCase(), cat)
    }

    const result = categoryByName.get((foundCategoryName as string).toLowerCase()) || null

    // Cache result (limit cache size to prevent memory growth)
    if (this.categoryCache.size > 1000) {
      this.categoryCache.clear()
    }
    this.categoryCache.set(cacheKey, result)

    return result
  }
}
