import type { Observable } from 'rxjs'
import type { Transaction } from '../entities/Transaction'

export interface ITransactionRepository {
  getAll(): Promise<Transaction[]>
  getByMonth(year: number, month: number): Promise<Transaction[]>
  create(transaction: Omit<Transaction, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Transaction>
  update(id: string, transaction: Partial<Transaction>): Promise<Transaction>
  delete(id: string): Promise<void>
  watchAll(): Observable<Transaction[]>

  // Specific for wallet transfers
  transferBetweenWallets(
    fromWalletId: string,
    toWalletId: string,
    amount: bigint,
    description?: string,
    date?: Date,
  ): Promise<void>
}
