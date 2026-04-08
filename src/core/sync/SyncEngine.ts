import { db } from '../db'
import { supabase } from '../supabase'

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
    if (!this.online) return
    
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
   * Main sync logic
   */
  async sync(): Promise<void> {
    if (this.isSyncing || !this.online) return
    
    const pending = await this.getPendingRecords()
    if (pending.length === 0) return

    this.isSyncing = true
    try {
      console.log(`[SyncEngine] Starting sync for ${pending.length} records...`)
      
      // Group records by table for bulk operations
      const grouped = pending.reduce((acc, record) => {
        if (!acc[record.table]) acc[record.table] = []
        acc[record.table].push(record.data)
        return acc
      }, {} as Record<string, any[]>)

      for (const tableName in grouped) {
        const records = grouped[tableName]
        await this.syncTableRecords(tableName, records)
      }
      
      console.log('[SyncEngine] Sync cycle completed successfully.')
    } catch (err) {
      console.error('[SyncEngine] Sync cycle failed:', err)
    } finally {
      this.isSyncing = false
    }
  }

  private async syncTableRecords(tableName: string, records: any[]) {
    const toDelete = records.filter(r => r.deleted)
    const toUpsert = records.filter(r => !r.deleted)

    // Bulk Delete
    if (toDelete.length > 0) {
      const deleteIds = toDelete.map(r => r.id).filter(Boolean)
      if (deleteIds.length > 0) {
        const { error } = await supabase.from(tableName).delete().in('id', deleteIds)
        if (!error) {
          const localKeys = toDelete.map(r => r.localId || r.id)
          await (db as any)[tableName].bulkDelete(localKeys)
        } else {
          console.error(`[SyncEngine] Bulk delete failed for ${tableName}:`, error)
          await this.markAsFailed(tableName, toDelete)
        }
      } else {
        // Record was never synced (no id), just delete locally
        const localKeys = toDelete.map(r => r.localId)
        await (db as any)[tableName].bulkDelete(localKeys)
      }
    }

    // Bulk Upsert
    if (toUpsert.length > 0) {
      const payload = toUpsert.map(r => {
        const { localId, syncStatus, ...rest } = r
        return rest
      })

      const { data, error } = await supabase
        .from(tableName)
        .upsert(payload)
        .select('id')

      if (!error) {
        const remoteIds = new Set(data?.map(d => d.id) || [])
        const syncedRecords = toUpsert.filter(r => remoteIds.has(r.id))
        
        for (const record of syncedRecords) {
          record.syncStatus = 'synced'
        }
        
        await (db as any)[tableName].bulkPut(syncedRecords)
      } else {
        console.error(`[SyncEngine] Bulk upsert failed for ${tableName}:`, error)
        await this.markAsFailed(tableName, toUpsert)
      }
    }
  }

  private async markAsFailed(tableName: string, records: any[]) {
    for (const record of records) {
      record.syncStatus = 'failed'
    }
    await (db as any)[tableName].bulkPut(records)
  }
}
