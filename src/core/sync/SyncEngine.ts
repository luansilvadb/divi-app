import { supabase } from '../supabase'
import { db } from '../db'
import { useSyncStore } from './syncStore'

/**
 * SyncEngine: Responsible for bi-directional synchronization between Dexie.js and Supabase.
 * Implements "Last Write Wins" (LWW) conflict resolution strategy.
 */
export class SyncEngine {
  private static instance: SyncEngine
  private isPushing = false

  constructor() {
    SyncEngine.instance = this
    if (import.meta.env.MODE !== 'test') {
      this.init()
    }
  }

  public static getInstance() {
    if (!SyncEngine.instance) {
      new SyncEngine()
    }
    return SyncEngine.instance
  }

  public static _resetInstance() {
    (SyncEngine as any).instance = undefined
  }

  private init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.trigger())
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') this.trigger()
      })
    }
  }

  private safeStore() {
    try {
      return useSyncStore()
    } catch {
      return null
    }
  }

  /**
   * Pushes pending local changes to Supabase.
   * Implements LWW by checking server timestamps before upserting.
   */
  public async pushDirtyRecords() {
    if (this.isPushing) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) return

    this.isPushing = true
    const store = this.safeStore()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      store?.setStatus('syncing')

      const syncableTables = [
        'transactions', 'wallets', 'categories', 'payees', 
        'loans', 'subscriptions', 'budgets', 'goals'
      ] as const

      for (const tableName of syncableTables) {
        const table = db.table(tableName)
        
        // Find records that are NOT synced
        const pendingRecords = await table
          .where('sync_status')
          .anyOf(['pending', 'failed'])
          .toArray()

        if (pendingRecords.length === 0) continue

        for (const record of pendingRecords) {
          // Implement LWW Check
          const { data: serverRecord, error: fetchError } = await supabase
            .from(tableName)
            .select('client_updated_at')
            .eq('id', record.id)
            .single()

          if (!fetchError && serverRecord) {
            const serverTime = new Date(serverRecord.client_updated_at).getTime()
            const clientTime = new Date(record.client_updated_at).getTime()
            
            if (serverTime > clientTime) {
              // Server is newer! Pull server version instead of pushing.
              // Logic will be implemented in Green phase
              continue
            }
          }

          // Push to Supabase
          const { error: upsertError } = await supabase
            .from(tableName)
            .upsert({ ...record, user_id: user.id }, { onConflict: 'id' })

          if (!upsertError) {
            await table.update(record.id, { 
              sync_status: 'synced',
              last_synced_at: new Date().toISOString()
            })
          } else {
            await table.update(record.id, { sync_status: 'failed' })
          }
        }
      }
      
      store?.setStatus('synced')
      store?.setLastSyncTime(new Date().toISOString())
    } catch (err) {
      console.error('[SyncEngine] Sync failed:', err)
      store?.setStatus('failed')
    } finally {
      this.isPushing = false
    }
  }

  public trigger() {
    this.pushDirtyRecords()
  }

  public async pullFromServer() {
    // To be implemented in Task 3
  }
}

export default SyncEngine
