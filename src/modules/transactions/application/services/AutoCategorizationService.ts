import type { Category } from '@/shared/domain/entities/Category'

export class AutoCategorizationService {
  private categoryMap: Record<string, string> = {
    netflix: 'Entertainment',
    spotify: 'Entertainment',
    uber: 'Transportation',
    ifood: 'Food',
    supermarket: 'Groceries',
    gas: 'Transportation',
    amazon: 'Shopping',
  }

  /**
   * Suggests a category based on the transaction title
   */
  suggestCategory(title: string, categories: Category[]): Category | null {
    const lowercaseTitle = title.toLowerCase()
    const foundKeyword = Object.keys(this.categoryMap).find((keyword) =>
      lowercaseTitle.includes(keyword),
    )

    if (foundKeyword) {
      const categoryName = this.categoryMap[foundKeyword]
      return categories.find((c) => c.name === categoryName) || null
    }

    return null
  }
}
