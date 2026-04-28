import { BehaviorSubject } from 'rxjs'
import type { ICategoryRepository } from '@/shared/domain/contracts/ICategoryRepository'
import type { Category } from '@/shared/domain/entities/Category'
import { useAuthStore } from '@/modules/auth/application/authStore'
import { AuthError, ValidationError, NotFoundError } from '@/core/errors'


export class CategoryService {
  private _categoriesSubject = new BehaviorSubject<Category[]>([])
  public readonly categoriesSubject = this._categoriesSubject
  public readonly categories$ = this._categoriesSubject.asObservable()

  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async loadCategories(): Promise<void> {
    const allCategories = await this.categoryRepository.getAll()
    // Single-pass filter using for loop (more efficient than .filter())
    const activeCategories: Category[] = []
    for (let i = 0, len = allCategories.length; i < len; i++) {
      if (!allCategories[i]!.deleted) activeCategories.push(allCategories[i]!)
    }
    this._categoriesSubject.next(activeCategories)

    if (activeCategories.length === 0) {
      await this.seedDefaultCategories()
    }
  }

  private async seedDefaultCategories(): Promise<void> {
    const authStore = useAuthStore()
    const userId = authStore.user?.id

    if (!userId) return

    const defaults: Partial<Category>[] = [
      { id: crypto.randomUUID(), name: 'Alimentação', icon: 'i-lucide-utensils', color: '#10b981' },
      { id: crypto.randomUUID(), name: 'Transporte', icon: 'i-lucide-bus', color: '#3b82f6' },
      { id: crypto.randomUUID(), name: 'Lazer', icon: 'i-lucide-ticket', color: '#8b5cf6' },
    ]

    for (const def of defaults) {
      await this.categoryRepository.create({
        name: def.name!,
        icon: def.icon!,
        color: def.color!,
        user_id: userId,
        parent_id: null,
      })
    }

    // Recarrega após o seed (single-pass filter)
    const allCategories = await this.categoryRepository.getAll()
    const activeCategories: Category[] = []
    for (let i = 0, len = allCategories.length; i < len; i++) {
      if (!allCategories[i]!.deleted) activeCategories.push(allCategories[i]!)
    }
    this._categoriesSubject.next(activeCategories)
  }

  async createCategory(params: { name: string; icon: string; color: string; parent_id?: string | null }): Promise<void> {
    // Guard clause: Authentication check
    const authStore = useAuthStore()
    const userId = authStore.user?.id
    if (!userId) throw new AuthError('User not authenticated')

    // Guard clause: Required field validation
    if (!params.name?.trim()) throw new ValidationError('Category name is required')
    if (!params.color?.trim()) throw new ValidationError('Category color is required')

    await this.categoryRepository.create({
      user_id: userId,
      name: params.name.trim(),
      icon: params.icon || 'i-lucide-tag',
      color: params.color,
      parent_id: params.parent_id || null,
    })
    await this.loadCategories()
  }

  async updateCategory(id: string, params: { name: string; icon: string; color: string; parent_id?: string | null }): Promise<void> {
    // Guard clause: ID validation
    if (!id?.trim()) throw new ValidationError('Category ID is required')

    const allCategories = await this.categoryRepository.getAll()

    // Use Map for O(1) lookup instead of O(n) find
    const categoryMap = new Map<string, Category>()
    for (const cat of allCategories) {
      categoryMap.set(cat.id, cat)
    }

    const existing = categoryMap.get(id)
    if (!existing) throw new NotFoundError('Category')

    // Guard clause: Required fields on update
    if (!params.name?.trim()) throw new ValidationError('Category name is required')

    await this.categoryRepository.update(id, {
      name: params.name.trim(),
      icon: params.icon,
      color: params.color,
      parent_id: params.parent_id,
    })
    await this.loadCategories()
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryRepository.delete(id)
    await this.loadCategories()
  }
}
