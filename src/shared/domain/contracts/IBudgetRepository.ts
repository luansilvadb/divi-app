import { type Observable } from 'rxjs'
import type { Budget } from '../entities/Budget'

export interface IBudgetRepository {
  getAllActive(): Promise<Budget[]>
  watchAll(): Observable<Budget[]>
  save(budget: Budget): Promise<void>
  delete(id: string): Promise<void>
}
