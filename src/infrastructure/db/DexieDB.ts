import Dexie, { type Table } from 'dexie'
import type { TransactionEntity } from './entities/TransactionEntity'

export class DiviDatabase extends Dexie {
  transactions!: Table<TransactionEntity>

  constructor(databaseName = 'DiviDB') {
    super(databaseName)
    this.version(1).stores({
      transactions: 'id, date, syncStatus, deleted'
    })
  }
}

export const db = new DiviDatabase()
