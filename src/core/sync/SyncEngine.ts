import { supabase } from '../supabase'
import { db } from '../db'
import { useSyncStore } from './syncStore'
import { SYNCABLE_TABLES } from './syncConfig'
import { v7 as uuidv7 } from 'uuid'

/**
 * SyncEngine: Responsible for bi-directional synchronization between Dexie.js and Supabase.
 * Implements "Last Write Wins" (LWW) conflict resolution strategy.
 */
export class SyncEngine {
  private static instance: SyncEngine
  private isPushing = false
  private isPulling = false
  private debounceId: ReturnType<typeof setTimeout> | null = null

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
    SyncEngine.instance = undefined as unknown as SyncEngine
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
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.warn('[SyncEngine] Auth required for sync. Skipping push.')
        this.isPushing = false
        return
      }

      store?.setStatus('syncing')

      for (const tableName of SYNCABLE_TABLES) {
        const table = db.table(tableName)

        const pendingRecords = await table
          .where('sync_status')
          .anyOf(['pending', 'failed'])
          .toArray()

        if (pendingRecords.length === 0) continue

        for (const record of pendingRecords) {
          // 1. Ensure user_id correctness & Ownership
          if (!record.user_id || record.user_id === '' || record.user_id !== user.id) {
            // SECURITY: If record has a different user_id, it's a leak from another session.
            // We MUST re-generate ID to avoid colliding with the other user's data on Supabase.
            if (record.user_id && record.user_id !== user.id) {
               console.warn(`[SyncEngine] Security leak detected: ${tableName}:${record.id} belongs to ${record.user_id}. Re-assigning to ${user.id} with new ID.`)
               const oldId = record.id
               const newId = uuidv7()
               const clonedRecord = { ...record, id: newId, user_id: user.id, sync_status: 'pending' }
               await table.add(clonedRecord)
               await table.delete(oldId)
               continue
            }
            
            // Just missing user_id: safe to just assign
            record.user_id = user.id
            await table.update(record.id, { user_id: user.id })
          }

          // 2. Conflict check
          const { data: serverMeta, error: fetchError } = await supabase
            .from(tableName)
            .select('client_updated_at, user_id')
            .eq('id', record.id)
            .maybeSingle()

          if (fetchError) {
            console.error(`[SyncEngine] Fetch check error for ${tableName}:${record.id}`, fetchError)
          }

          if (!fetchError && serverMeta) {
            // RLS PROTECT: If record belongs to another user on server, we CANNOT upsert it.
            // This happens if local DB was not cleared properly and RLS allows us to see the ID.
            if (serverMeta.user_id !== user.id) {
              console.error(`[SyncEngine] Security conflict: ID ${record.id} in ${tableName} belongs to another user on server. Re-generating local ID.`)
              
              const oldId = record.id
              const newId = uuidv7()
              
              // Clone record with new ID
              const clonedRecord = { ...record, id: newId, user_id: user.id, sync_status: 'pending' }
              await table.add(clonedRecord)
              await table.delete(oldId)
              
              continue
            }

            const serverTime = new Date(serverMeta.client_updated_at).getTime()
            const clientTime = new Date(record.client_updated_at).getTime()

            if (serverTime > clientTime) {
              console.warn(`[SyncEngine] LWW: Server is newer for ${tableName}:${record.id}. Pulling.`)
              const { data: fullServerRecord, error: pullError } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', record.id)
                .single()

              if (!pullError && fullServerRecord) {
                await table.put({
                  ...fullServerRecord,
                  sync_status: 'synced',
                  last_synced_at: new Date().toISOString(),
                })
              }
              continue
            }
          }

          // 3. Prepare Payload
          const {
            sync_status: _sync_status,
            last_synced_at: _last_synced_at,
            localId: _localId,
            ...payload
          } = record as Record<string, unknown>
          delete payload.syncStatus
          delete payload.is_dirty
          delete payload.last_modified_at
          delete payload.server_updated_at // Let server or this loop set it freshly

          Object.keys(payload).forEach((key) => {
            if (key.startsWith('_')) {
              delete payload[key]
            }
            if (key.endsWith('_id') && payload[key] === '') {
               payload[key] = null
            }
          })

          payload.user_id = user.id

          if (payload.deleted) {
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .eq('id', record.id)

            if (!deleteError || deleteError.code === 'PGRST116') { // Success or already gone
              await table.delete(record.id)
            } else {
              console.error(`[SyncEngine] Delete error in ${tableName}:${record.id}`, deleteError)
              await table.update(record.id, { sync_status: 'failed' })
            }
            continue
          }

          console.debug(`[SyncEngine] Pushing ${tableName}:${record.id}`, payload)
          console.debug(`[SyncEngine] Final Full Payload for ${tableName}:`, {
            ...payload,
            server_updated_at: new Date().toISOString(),
          })

          const { error: upsertError } = await supabase.from(tableName).upsert(
            {
              ...payload,
              server_updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' },
          )

          if (!upsertError) {
            await table.update(record.id, {
              sync_status: 'synced',
              last_synced_at: new Date().toISOString(),
            })
          } else if (upsertError.code === 'PGRST204') {
            // Schema mismatch: local has columns that server doesn't yet (pending SQL migration).
            // Extract unknown column name from error message and retry without it.
            const columnMatch = upsertError.message.match(/the '(\w+)' column/)
            if (columnMatch) {
              const unknownColumn = columnMatch[1]!
              console.warn(`[SyncEngine] Schema mismatch: stripping '${unknownColumn}' from ${tableName}:${record.id} payload and retrying.`)
              
              const strippedPayload = { ...payload, server_updated_at: new Date().toISOString() }
              delete (strippedPayload as Record<string, unknown>)[unknownColumn]

              const { error: retryError } = await supabase.from(tableName).upsert(
                strippedPayload,
                { onConflict: 'id' },
              )

              if (!retryError) {
                await table.update(record.id, {
                  sync_status: 'synced',
                  last_synced_at: new Date().toISOString(),
                })
              } else {
                console.error(`[SyncEngine] Retry failed for ${tableName}:${record.id}`, retryError)
                await table.update(record.id, { sync_status: 'failed' })
              }
            } else {
              console.error(`[SyncEngine] PGRST204 but couldn't extract column name for ${tableName}:${record.id}`, upsertError)
              await table.update(record.id, { sync_status: 'failed' })
            }
          } else {
            console.error(`[SyncEngine] Upsert error in ${tableName}:${record.id}`, {
              code: upsertError.code,
              message: upsertError.message,
              details: upsertError.details,
              hint: upsertError.hint,
              payload: {
                ...payload,
                server_updated_at: new Date().toISOString(),
              },
              currentUser: user.id
            })

            // 4. Handle RLS violation (42501)
            if (upsertError.code === '42501') {
              // Diagnostic: capture full session state for debugging
              const { data: sessionData } = await supabase.auth.getSession()
              console.error(`[SyncEngine] ⛔ RLS VIOLATION for ${tableName}:${record.id}`, {
                message: upsertError.message,
                payloadUserId: payload.user_id,
                authUserId: user.id,
                sessionExists: !!sessionData?.session,
                sessionUserId: sessionData?.session?.user?.id,
                tokenExpiry: sessionData?.session?.expires_at
                  ? new Date(sessionData.session.expires_at * 1000).toISOString()
                  : 'N/A',
                userIdMatch: payload.user_id === sessionData?.session?.user?.id,
              })

              // DO NOT regenerate ID — that causes infinite loops.
              // 42501 means the RLS policy itself is blocking the INSERT, not an ID conflict.
              // Mark as 'failed' so it doesn't retry infinitely.
              await table.update(record.id, { sync_status: 'failed' })
              console.warn(`[SyncEngine] Record ${tableName}:${record.id} marked as 'failed'. Check Supabase RLS policies for INSERT on table "${tableName}".`)
            } else {
              await table.update(record.id, { sync_status: 'failed' })
            }
          }
        }
      }

      store?.setStatus('synced')
      store?.setLastSyncTime(new Date().toISOString())
    } catch (err) {
      if (err instanceof Error && err.name === 'NavigatorLockAcquireTimeoutError') {
        console.warn('[SyncEngine] Auth lock timeout.')
      } else {
        console.error('[SyncEngine] Push failed:', err)
      }
      store?.setStatus('failed')
    } finally {
      this.isPushing = false
    }
  }

  /**
   * Pulls all data from server that user has access to.
   */
  public async pullFromServer() {
    if (this.isPulling) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) return

    this.isPulling = true
    const store = this.safeStore()
    let hasChanges = false

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        this.isPulling = false
        return
      }

      for (const tableName of SYNCABLE_TABLES) {
        const table = db.table(tableName)

        const { data: serverData, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', user.id)

        if (error) {
          console.error(`[SyncEngine] Error pulling from ${tableName}:`, error)
          continue
        }

        if (error || !serverData) continue

        for (const item of serverData) {
          const local = await table.get(item.id)

          if (!local) {
            await table.add({
              ...item,
              sync_status: 'synced',
              last_synced_at: new Date().toISOString(),
            })
            hasChanges = true
          } else if (local.sync_status === 'synced') {
            if (item.server_updated_at !== local.server_updated_at) {
              await table.put({
                ...item,
                sync_status: 'synced',
                last_synced_at: new Date().toISOString(),
              })
              hasChanges = true
            }
          } else {
            const serverTime = new Date(item.client_updated_at).getTime()
            const clientTime = new Date(local.client_updated_at).getTime()

            if (serverTime > clientTime) {
              await table.put({
                ...item,
                sync_status: 'synced',
                last_synced_at: new Date().toISOString(),
              })
              hasChanges = true
            }
          }
        }

        const localSynced = await table.where('sync_status').equals('synced').toArray()
        const serverIds = new Set(serverData.map((s) => s.id))

        const orphans = localSynced.filter((r) => !serverIds.has(r.id))
        if (orphans.length > 0) {
          await table.bulkDelete(orphans.map((o) => o.id))
          hasChanges = true
        }
      }

      if (hasChanges) {
        store?.notifyChange()
      }
    } catch (err) {
      if (!(err instanceof Error && err.name === 'NavigatorLockAcquireTimeoutError')) {
        console.error('[SyncEngine] Pull failed:', err)
      }
    } finally {
      this.isPulling = false
    }
  }
}

export default SyncEngine
