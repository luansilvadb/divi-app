import { db } from '../db'

export interface SyncRecord {
  table: string
  data: any
}

export class SyncEngine {
  private monitoredTables = [
    'transactions',
    'wallets',
    'categories',
    'payees',
    'loans',
    'subscriptions'
  ] as const

  /**
   * Scans all monitored tables for records that are pending or failed to sync.
   */
  async getPendingRecords(): Promise<SyncRecord[]> {
    const results: SyncRecord[] = []

    for (const tableName of this.monitoredTables) {
      const table = (db as any)[tableName]
      
      const pending = await table
        .where('syncStatus')
        .anyOf(['pending', 'failed'])
        .toArray()

      pending.forEach((record: any) => {
        results.push({
          table: tableName,
          data: record
        })
      })
    }

    return results
  }
}
