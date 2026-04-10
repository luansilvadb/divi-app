import type { Observable } from 'rxjs'
import type { Transaction } from '../domain/Transaction'

export interface TransactionRepositoryPort {
  save(transaction: Transaction): Promise<void>
  getAll(): Promise<Transaction[]>
  getByMonth(year: number, month: number): Promise<Transaction[]>
  watchAll(): Observable<Transaction[]> // Dexie liveQuery return type is technically Observable-compatible
}

