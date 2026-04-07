import type { Transaction } from '../domain/Transaction'

export interface TransactionRepositoryPort {
  save(transaction: Transaction): Promise<void>
  getAll(): Promise<Transaction[]>
  watchAll(): any // Dexie liveQuery return type is technically Observable-compatible
}
