import type { Observable } from 'rxjs'
import type { ITransaction } from '../entities/ITransaction'

export interface ITransactionService {
  readonly transactions$: Observable<ITransaction[]>
  loadMonthlytransactions(year: number, month: number): Promise<void>
  saveITransaction(params: any): Promise<void>
  deleteITransaction(id: string, year: number, month: number): Promise<void>
}
