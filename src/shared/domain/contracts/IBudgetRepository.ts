import { type Observable } from 'rxjs'
import type { Budget } from '../entities/Budget'

export interface IBudgetRepository {
  getAllActive(): Promise<Budget[]>
  watchAll(): Observable<Budget[]>
  create(budget: Omit<Budget, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Budget>
  update(id: string, budget: Partial<Budget>): Promise<Budget>
  delete(id: string): Promise<void>
}
