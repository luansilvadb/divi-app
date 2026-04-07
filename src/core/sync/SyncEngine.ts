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

  private isSyncing = false
  private online = navigator.onLine

  constructor() {
    this.registerHooks()
    this.initNetworkListener()
  }

  private initNetworkListener() {
    window.addEventListener('online', () => {
      this.online = true
      console.log('[SyncEngine] Network is online. Resuming sync...')
      this.sync().catch(err => console.error('[SyncEngine] Online sync failed', err))
    })

    window.addEventListener('offline', () => {
      this.online = false
      console.log('[SyncEngine] Network is offline. Pausing sync...')
    })
  }

  private registerHooks() {
    for (const tableName of this.monitoredTables) {
      const table = (db as any)[tableName]
      
      table.hook('creating', (_primKey: any, obj: any) => {
        if (obj.syncStatus !== 'synced') {
          this.triggerSync()
        }
      })

      table.hook('updating', (mods: any, _primKey: any, _obj: any) => {
        if (mods.syncStatus === 'pending' || mods.syncStatus === 'failed') {
          this.triggerSync()
        }
      })
    }
  }

  private triggerSync() {
    // Debounced sync call
    setTimeout(() => {
      this.sync().catch(err => console.error('[SyncEngine] Sync failed', err))
    }, 1000)
  }

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

  /**
   * Main sync logic (to be implemented in Phase 3)
   */
  async sync(): Promise<void> {
    if (this.isSyncing) return
    
    const pending = await this.getPendingRecords()
    if (pending.length === 0) return

    this.isSyncing = true
    try {
      console.log(`[SyncEngine] Starting sync for ${pending.length} records...`)
      // Phase 3 implementation will go here
    } finally {
      this.isSyncing = false
    }
  }
}
