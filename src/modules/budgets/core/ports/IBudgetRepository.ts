import { type Observable } from 'rxjs'
import type { IBudget } from '../entities/IBudget'

export interface IBudgetRepository {
  getAllActive(): Promise<IBudget[]>
  watchAll(): Observable<IBudget[]>
  create(budget: Omit<IBudget, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<IBudget>
  update(id: string, budget: Partial<IBudget>): Promise<IBudget>
  delete(id: string): Promise<void>
}
