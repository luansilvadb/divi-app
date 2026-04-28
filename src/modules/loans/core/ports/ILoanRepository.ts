import type { ILoan } from '../entities/ILoan'

export interface ILoanRepository {
  getAll(): Promise<ILoan[]>
  save(loan: ILoan): Promise<void>
  delete(id: string): Promise<void>
}
