import type { Category } from '../entities/Category'

export interface ICategoryRepository {
  getAll(): Promise<Category[]>
  save(category: Category): Promise<void>
  delete(id: string): Promise<void>
}
