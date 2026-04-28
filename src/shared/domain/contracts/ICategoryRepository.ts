import type { Category } from '../entities/Category'

export interface ICategoryRepository {
  getAll(): Promise<Category[]>
  create(category: Omit<Category, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Category>
  update(id: string, category: Partial<Category>): Promise<Category>
  delete(id: string): Promise<void>
}
