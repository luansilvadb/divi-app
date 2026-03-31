import type { Payee } from '../entities/Payee'

export interface IPayeeRepository {
  getAll(): Promise<Payee[]>
  save(payee: Payee): Promise<void>
  getByName(name: string): Promise<Payee | null>
}
