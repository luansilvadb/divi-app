import { liveQuery } from 'dexie'
import type { TransactionRepositoryPort } from '../application/TransactionRepositoryPort'
import type { Transaction } from '../domain/Transaction'
import type { DiviDatabase } from '@/infrastructure/db/DexieDB'
import type { TransactionEntity } from '@/infrastructure/db/entities/TransactionEntity'

export class DexieTransactionRepository implements TransactionRepositoryPort {
  constructor(private db: DiviDatabase) {}

  async save(transaction: Transaction): Promise<void> {
    const entity: TransactionEntity = {
      ...transaction,
      syncStatus: 'pending'
    }
    await this.db.transactions.put(entity)
  }

  async getAll(): Promise<Transaction[]> {
    const entities = await this.db.transactions.toArray()
    return entities.map(this.mapToDomain)
  }

  async getByMonth(year: number, month: number): Promise<Transaction[]> {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()
    const entities = await this.db.transactions
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray()
    return entities.map(this.mapToDomain)
  }

  watchAll(): any {
    return liveQuery(() => this.db.transactions.toArray())
  }

  async delete(id: string): Promise<void> {
    await this.db.transactions.delete(id)
  }

  async sync(): Promise<void> {
    // Out of scope for Epic 1
  }

  private mapToDomain(entity: TransactionEntity): Transaction {
    const { syncStatus, ...domain } = entity
    return domain as Transaction
  }
}
