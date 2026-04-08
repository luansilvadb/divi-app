import { supabase } from '../supabase'
import { db } from '../db'
import { useSyncStore } from './syncStore'
import { SYNCABLE_TABLES } from './syncConfig'

/**
 * SyncEngine: Responsible for bi-directional synchronization between Dexie.js and Supabase.
 * Implements "Last Write Wins" (LWW) conflict resolution strategy.
 */
export class SyncEngine {
  private static instance: SyncEngine
  private isPushing = false
  private isPulling = false
  private debounceId: any = null

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
      
      // Periodic sync every 5 minutes
      setInterval(() => this.trigger(), 5 * 60 * 1000)
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
   * Pushes pending local changes to Supabase and Pulls updates.
   */
  public async trigger() {
    if (this.isPushing || this.isPulling) return
    await this.pushDirtyRecords()
    await this.pullFromServer()
  }

  /**
   * Enqueues a sync operation with a small debounce to group multiple local changes.
   */
  public enqueueSync() {
    if (this.debounceId) {
      clearTimeout(this.debounceId)
    }
    this.debounceId = setTimeout(() => {
      this.trigger()
      this.debounceId = null
    }, 500) // 500ms debounce to allow multiple changes to group
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

      for (const tableName of SYNCABLE_TABLES) {
        const table = db.table(tableName)
        
        // Find records that are NOT synced
        const pendingRecords = await table
          .where('sync_status')
          .anyOf(['pending', 'failed'])
          .toArray()

        if (pendingRecords.length === 0) continue

        for (const record of pendingRecords) {
          // 1. Fetch current server state for this ID to check for conflicts
          const { data: serverRecord, error: fetchError } = await supabase
            .from(tableName)
            .select('client_updated_at, version')
            .eq('id', record.id)
            .maybeSingle()

          if (!fetchError && serverRecord) {
            const serverTime = new Date(serverRecord.client_updated_at).getTime()
            const clientTime = new Date(record.client_updated_at).getTime()
            
            // LWW Strategy: If server is NEWER, we pull and resolve locally
            if (serverTime > clientTime) {
              console.warn(`[SyncEngine] Conflict detected for ${tableName}:${record.id}. Server is newer. Pulling server version.`)
              const { data: fullServerRecord, error: pullError } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', record.id)
                .single()
              
              if (!pullError && fullServerRecord) {
                await table.put({
                  ...fullServerRecord,
                  sync_status: 'synced',
                  last_synced_at: new Date().toISOString()
                })
              }
              continue // Skip pushing this record
            }
          }

          // 2. Push to Supabase
          // Sanitize record to remove legacy/local-only fields
          const { sync_status: _sync_status, ...payload } = record as any
          delete (payload as any).syncStatus
          delete (payload as any).is_dirty
          delete (payload as any).last_modified_at
          delete (payload as any).localId

          // Convert empty strings to null for UUID fields (Postgres requirement)
          Object.keys(payload).forEach(key => {
            if (key.endsWith('_id') && payload[key] === '') {
              payload[key] = null
            }
          })

          if (payload.deleted) {
            // HARD DELETE on server if marked as deleted
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .eq('id', record.id)

            if (!deleteError) {
              await table.delete(record.id) // Physical delete locally after server confirmation
            } else {
              console.error(`[SyncEngine] Delete error in ${tableName}:${record.id}`, deleteError)
              await table.update(record.id, { sync_status: 'failed' })
            }
            continue
          }

          const { error: upsertError } = await supabase
            .from(tableName)
            .upsert({ 
              ...payload, 
              user_id: user.id,
              server_updated_at: new Date().toISOString(),
              sync_status: 'synced' // Clear status on server
            }, { onConflict: 'id' })

          if (!upsertError) {
            await table.update(record.id, { 
              sync_status: 'synced',
              last_synced_at: new Date().toISOString()
            })
          } else {
            console.error(`[SyncEngine] Upsert error in ${tableName}:${record.id}`, upsertError)
            await table.update(record.id, { sync_status: 'failed' })
          }
        }
      }
      
      store?.setStatus('synced')
      store?.setLastSyncTime(new Date().toISOString())
    } catch (err) {
      console.error('[SyncEngine] Push failed:', err)
      store?.setStatus('failed')
    } finally {
      this.isPushing = false
    }
  }

  /**
   * Pulls all data from server that user has access to.
   * Basic reconciliation: overwrites local ONLY if server is newer or local is synced.
   */
  public async pullFromServer() {
    if (this.isPulling) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) return

    this.isPulling = true
    const store = this.safeStore()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      for (const tableName of SYNCABLE_TABLES) {
        const table = db.table(tableName)
        
        const { data: serverData, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', user.id)

        if (error || !serverData) continue

        for (const item of serverData) {
          const local = await table.get(item.id)
          
          if (!local) {
            // New record from server
            await table.add({ ...item, sync_status: 'synced', last_synced_at: new Date().toISOString() })
          } else if (local.sync_status === 'synced') {
            // Overwrite local if it's already synced (server is ground truth)
            await table.put({ ...item, sync_status: 'synced', last_synced_at: new Date().toISOString() })
          } else {
            // Conflict check for pending local changes
            const serverTime = new Date(item.client_updated_at).getTime()
            const clientTime = new Date(local.client_updated_at).getTime()
            
            if (serverTime > clientTime) {
              await table.put({ ...item, sync_status: 'synced', last_synced_at: new Date().toISOString() })
            }
          }
        }

        // Phantom cleanup: Remove local records that were synced but no longer on server
        const localSynced = await table.where('sync_status').equals('synced').toArray()
        const serverIds = new Set(serverData.map(s => s.id))
        
        const orphans = localSynced.filter(r => !serverIds.has(r.id))
        if (orphans.length > 0) {
          await table.bulkDelete(orphans.map(o => o.id))
        }
      }
      
      store?.notifyChange()
    } catch (err) {
      console.error('[SyncEngine] Pull failed:', err)
    } finally {
      this.isPulling = false
    }
  }
}

export default SyncEngine
