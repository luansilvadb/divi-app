import type { Loan } from '../entities/Loan'

export interface ILoanRepository {
  getAll(): Promise<Loan[]>
  save(loan: Loan): Promise<void>
  delete(id: string): Promise<void>
}
