import type { ICategory } from '../entities/ICategory'

export interface ICategoryRepository {
  getAll(): Promise<ICategory[]>
  create(category: Omit<ICategory, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<ICategory>
  update(id: string, category: Partial<ICategory>): Promise<ICategory>
  delete(id: string): Promise<void>
}
