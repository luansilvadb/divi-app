import type { IPayee } from '../entities/IPayee'

export interface IPayeeRepository {
  getAll(): Promise<IPayee[]>
  save(payee: IPayee): Promise<void>
  getByName(name: string): Promise<IPayee | null>
}
