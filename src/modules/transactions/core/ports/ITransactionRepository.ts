import type { Observable } from 'rxjs'
import type { ITransaction } from '../entities/ITransaction'

export interface ITransactionRepository {
  getAll(): Promise<ITransaction[]>
  getByMonth(year: number, month: number): Promise<ITransaction[]>
  create(ITransaction: Omit<ITransaction, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<ITransaction>
  update(id: string, ITransaction: Partial<ITransaction>): Promise<ITransaction>
  delete(id: string): Promise<void>
  watchAll(): Observable<ITransaction[]>

  // Specific for IWallet transfers
  transferBetweenwallets(
    fromIWalletId: string,
    toIWalletId: string,
    amount: bigint,
    description?: string,
    date?: Date,
  ): Promise<void>
}
