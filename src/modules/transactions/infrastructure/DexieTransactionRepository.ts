import { liveQuery } from 'dexie'
import type { TransactionRepositoryPort } from '../application/TransactionRepositoryPort'
import type { Transaction } from '../domain/Transaction'
import type { DiviDatabase } from '../../../../infrastructure/db/DexieDB'
import type { TransactionEntity } from '../../../../infrastructure/db/entities/TransactionEntity'

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

  watchAll(): any {
    return liveQuery(() => this.db.transactions.toArray())
  }

  private mapToDomain(entity: TransactionEntity): Transaction {
    const { syncStatus, ...domain } = entity
    return domain as Transaction
  }
}
