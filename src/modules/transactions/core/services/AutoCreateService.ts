import type { ICategory } from '@/modules/categories/core/entities/ICategory'
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'
import { CategoryService } from '@/modules/categories/application/services/CategoryService'
import { walletservice } from '@/modules/wallets/application/services/walletservice'

const DEFAULT_COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
]

export class AutoCreateService {
  constructor(
    private categoryService: CategoryService,
    private walletservice: walletservice,
  ) {}

  async resolveCategory(
    categoryId: string | null,
    categories: ICategory[],
  ): Promise<string | null> {
    if (!categoryId) return null

    // Build Maps for O(1) lookups (single pass)
    const categoryById = new Map<string, ICategory>()
    const categoryByName = new Map<string, ICategory>()

    for (const cat of categories) {
      categoryById.set(cat.id, cat)
      categoryByName.set(cat.name.toLowerCase(), cat)
    }

    // Check if ID exists (O(1))
    if (categoryById.has(categoryId)) {
      return categoryId
    }

    // Look up by name (case-insensitive) (O(1))
    const existingByName = categoryByName.get(categoryId.toLowerCase())
    if (existingByName) {
      return existingByName.id
    }

    // Create new category
    const randomColor = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]!
    await this.categoryService.createCategory({
      name: categoryId,
      icon: 'i-lucide-tag',
      color: randomColor,
      parent_id: null,
    })

    // Re-fetch and return the new category ID using Map
    await this.categoryService.loadCategories()
    const updatedCategories = this.categoryService.categoriesSubject.getValue()
    const updatedCategoryByName = new Map<string, ICategory>()
    for (const cat of updatedCategories) {
      updatedCategoryByName.set(cat.name, cat)
    }

    return updatedCategoryByName.get(categoryId)?.id || null
  }

  async resolveIWallet(
    IWalletId: string | null,
    wallets: IWallet[],
  ): Promise<string | null> {
    if (!IWalletId) return null

    // Build Maps for O(1) lookups (single pass)
    const IWalletById = new Map<string, IWallet>()
    const IWalletByName = new Map<string, IWallet>()

    for (const IWallet of wallets) {
      IWalletById.set(IWallet.id, IWallet)
      IWalletByName.set(IWallet.name.toLowerCase(), IWallet)
    }

    // Check if ID exists (O(1))
    if (IWalletById.has(IWalletId)) {
      return IWalletId
    }

    // Look up by name (case-insensitive) (O(1))
    const existingByName = IWalletByName.get(IWalletId.toLowerCase())
    if (existingByName) {
      return existingByName.id
    }

    // Create new IWallet
    await this.walletservice.createIWallet({
      name: IWalletId,
      type: 'checking',
      currency: 'BRL',
      icon: 'i-lucide-IWallet',
      balance: 0,
    })

    // Re-fetch and return the new IWallet ID using Map
    await this.walletservice.loadwallets()
    const updatedwallets = this.walletservice.walletsSubject.getValue()
    const updatedIWalletByName = new Map<string, IWallet>()
    for (const IWallet of updatedwallets) {
      updatedIWalletByName.set(IWallet.name, IWallet)
    }

    return updatedIWalletByName.get(IWalletId)?.id || null
  }
}
