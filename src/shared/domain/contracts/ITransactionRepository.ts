import type { Transaction } from '../entities/Transaction'

export interface ITransactionRepository {
  getAll(): Promise<Transaction[]>
  getByMonth(year: number, month: number): Promise<Transaction[]>
  save(transaction: Transaction): Promise<void>
  delete(id: string): Promise<void>
  watchAll(): any
}
