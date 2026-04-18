import type { Category } from '@/shared/domain/entities/Category'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import { CategoryService } from '@/modules/categories/application/services/CategoryService'
import { WalletService } from '@/modules/wallets/application/services/WalletService'

const DEFAULT_COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
]

export class AutoCreateService {
  constructor(
    private categoryService: CategoryService,
    private walletService: WalletService,
  ) {}

  async resolveCategory(
    categoryId: string | null,
    categories: Category[],
  ): Promise<string | null> {
    if (!categoryId) return null

    // Build Maps for O(1) lookups (single pass)
    const categoryById = new Map<string, Category>()
    const categoryByName = new Map<string, Category>()

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
    const updatedCategoryByName = new Map<string, Category>()
    for (const cat of updatedCategories) {
      updatedCategoryByName.set(cat.name, cat)
    }

    return updatedCategoryByName.get(categoryId)?.id || null
  }

  async resolveWallet(
    walletId: string | null,
    wallets: Wallet[],
  ): Promise<string | null> {
    if (!walletId) return null

    // Build Maps for O(1) lookups (single pass)
    const walletById = new Map<string, Wallet>()
    const walletByName = new Map<string, Wallet>()

    for (const wallet of wallets) {
      walletById.set(wallet.id, wallet)
      walletByName.set(wallet.name.toLowerCase(), wallet)
    }

    // Check if ID exists (O(1))
    if (walletById.has(walletId)) {
      return walletId
    }

    // Look up by name (case-insensitive) (O(1))
    const existingByName = walletByName.get(walletId.toLowerCase())
    if (existingByName) {
      return existingByName.id
    }

    // Create new wallet
    await this.walletService.createWallet({
      name: walletId,
      type: 'checking',
      currency: 'BRL',
      icon: 'i-lucide-wallet',
      balance: 0,
    })

    // Re-fetch and return the new wallet ID using Map
    await this.walletService.loadWallets()
    const updatedWallets = this.walletService.walletsSubject.getValue()
    const updatedWalletByName = new Map<string, Wallet>()
    for (const wallet of updatedWallets) {
      updatedWalletByName.set(wallet.name, wallet)
    }

    return updatedWalletByName.get(walletId)?.id || null
  }
}
