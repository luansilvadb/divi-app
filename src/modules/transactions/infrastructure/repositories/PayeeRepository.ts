import type { IPayeeRepository } from '@/shared/domain/contracts/IPayeeRepository'
import type { Payee } from '@/shared/domain/entities/Payee'
import { db } from '@/core/db'

export class DexiePayeeRepository implements IPayeeRepository {
  async getAll(): Promise<Payee[]> {
    const list = await db.table('payees').toArray()
    return list as Payee[]
  }

  async save(payee: Payee): Promise<void> {
    await db.table('payees').put(payee)
  }

  async getByName(name: string): Promise<Payee | null> {
    const payee = await db.table('payees').where('name').equals(name).first()
    return payee ? (payee as Payee) : null
  }
}

