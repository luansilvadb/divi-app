import { supabase } from '../supabase'
import { vaultDb as db } from '@/infrastructure/storage/VaultDatabase'
import { BigIntAdapter } from '@/shared/utils/bigint-adapter'
import { useSyncStore } from './syncStore'
import { SYNCABLE_TABLES } from './syncConfig'
import { v7 as uuidv7 } from 'uuid'
import { VaultCryptoManager } from '@/infrastructure/crypto/VaultCryptoManager'
import type { ISyncEngine } from './ports/ISyncEngine'

/**
 * SyncEngine: Responsible for bi-directional synchronization between Dexie.js and Supabase.
 * Implements "Last Write Wins" (LWW) conflict resolution strategy.
 */
export class SyncEngine implements ISyncEngine {
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

    const crypto = VaultCryptoManager.getInstance()
    if (!crypto.hasKey()) {
      console.warn('[SyncEngine] Vault locked. Skipping push until vault is unlocked.')
      return
    }

    const user = await this.getAuthenticatedUser()
    if (!user) return

    this.isPushing = true
    const store = this.safeStore()
    store?.setStatus('syncing')

    try {
      for (const tableName of SYNCABLE_TABLES) {
        await this.pushTableRecords(tableName, user.id, crypto)
      }

      store?.setStatus('synced')
      store?.setLastSyncTime(new Date().toISOString())
    } catch (err) {
      this.handlePushError(err, store)
    } finally {
      this.isPushing = false
    }
  }

  private async getAuthenticatedUser(): Promise<{ id: string } | null> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.warn('[SyncEngine] Auth required for sync. Skipping push.')
      return null
    }

    return user
  }

  private handlePushError(err: unknown, store: ReturnType<typeof useSyncStore> | null): void {
    if (err instanceof Error && err.name === 'NavigatorLockAcquireTimeoutError') {
      console.warn('[SyncEngine] Auth lock timeout.')
    } else {
      console.error('[SyncEngine] Push failed:', err)
    }
    store?.setStatus('failed')
  }

  private async pushTableRecords(tableName: string, userId: string, crypto: VaultCryptoManager): Promise<void> {
    const table = db.table(tableName)
    const pendingRecords = await table
      .where('sync_status')
      .anyOf(['pending', 'failed'])
      .toArray()

    for (const record of pendingRecords) {
      await this.pushRecord(table, tableName, record, userId, crypto)
    }
  }

  private async pushRecord(
    table: any,
    tableName: string,
    record: any,
    userId: string,
    crypto: VaultCryptoManager
  ): Promise<void> {
    const recordId = await this.ensureOwnership(table, record, userId, tableName)
    if (!recordId) return

    const shouldSkip = await this.resolveConflict(table, tableName, record, userId, crypto)
    if (shouldSkip) return

    const finalPayload = await this.preparePayload(record, userId, crypto)
    if (!finalPayload) return

    if (finalPayload.deleted) {
      await this.handleDeletedRecord(table, tableName, recordId, finalPayload)
      return
    }

    await this.upsertRecord(table, tableName, recordId, finalPayload, userId)
  }

  private async ensureOwnership(
    table: any,
    record: any,
    userId: string,
    tableName: string
  ): Promise<string | null> {
    if (!record.user_id || record.user_id === '' || record.user_id !== userId) {
      if (record.user_id && record.user_id !== userId) {
        console.warn(`[SyncEngine] Security leak detected: ${tableName}:${record.id} belongs to ${record.user_id}. Re-assigning to ${userId} with new ID.`)
        const newId = uuidv7()
        const clonedRecord = { ...record, id: newId, user_id: userId, sync_status: 'pending' }
        await table.add(clonedRecord)
        await table.delete(record.id)
        return newId
      }

      record.user_id = userId
      await table.update(record.id, { user_id: userId })
    }

    return record.id
  }

  private async resolveConflict(
    table: any,
    tableName: string,
    record: any,
    userId: string,
    crypto: VaultCryptoManager
  ): Promise<boolean> {
    const { data: serverMeta, error: fetchError } = await supabase
      .from(tableName)
      .select('client_updated_at, user_id, version')
      .eq('id', record.id)
      .maybeSingle()

    if (fetchError) {
      console.error(`[SyncEngine] Fetch check error for ${tableName}:${record.id}`, fetchError)
    }

    if (!fetchError && serverMeta) {
      if (serverMeta.user_id !== userId) {
        console.error(`[SyncEngine] Security conflict: ID ${record.id} in ${tableName} belongs to another user on server. Re-generating local ID.`)
        const newId = uuidv7()
        const clonedRecord = { ...record, id: newId, user_id: userId, sync_status: 'pending' }
        await table.add(clonedRecord)
        await table.delete(record.id)
        return true
      }

      if (await this.serverWins(serverMeta, record)) {
        console.warn(`[SyncEngine] LWW: Server is newer for ${tableName}:${record.id}. Pulling.`)
        await this.pullServerRecord(table, tableName, record.id, crypto)
        return true
      }
    }

    return false
  }

  private async serverWins(serverMeta: any, record: any): Promise<boolean> {
    const serverVersion = serverMeta.version || 0
    const clientVersion = record.version || 1

    if (serverVersion > clientVersion) return true
    if (serverVersion === clientVersion) {
      const serverTime = new Date(serverMeta.client_updated_at).getTime()
      const clientTime = new Date(record.client_updated_at).getTime()
      return serverTime > clientTime
    }

    return false
  }

  private async pullServerRecord(
    table: any,
    tableName: string,
    recordId: string,
    crypto: VaultCryptoManager
  ): Promise<void> {
    const { data: fullServerRecord, error: pullError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', recordId)
      .single()

    if (pullError || !fullServerRecord) return

    const processedServerItem = await this.decryptServerRecord(fullServerRecord, tableName, recordId, crypto)
    if (!processedServerItem) return

    await table.put({
      ...processedServerItem,
      sync_status: 'synced',
      last_synced_at: new Date().toISOString(),
    })
  }

  private async decryptServerRecord(
    fullServerRecord: any,
    tableName: string,
    recordId: string,
    crypto: VaultCryptoManager
  ): Promise<any | null> {
    let processedServerItem = { ...fullServerRecord }

    if (!fullServerRecord.encrypted_payload || !crypto.hasKey()) {
      return processedServerItem
    }

    try {
      const decrypted = await crypto.decrypt(fullServerRecord.encrypted_payload)
      try {
        const decryptedData = JSON.parse(decrypted)
        processedServerItem = { ...fullServerRecord, ...decryptedData }
        delete processedServerItem.encrypted_payload
        return processedServerItem
      } catch (parseError) {
        console.error(`[SyncEngine] Data corruption detected in decrypted record ${tableName}:${recordId}`, parseError)
        return null
      }
    } catch (err) {
      console.error(`[SyncEngine] Failed to decrypt server record ${tableName}:${recordId}. Key might be incorrect.`, err)
      return null
    }
  }

  private async preparePayload(
    record: any,
    userId: string,
    crypto: VaultCryptoManager
  ): Promise<Record<string, any> | null> {
    const {
      sync_status: _sync_status,
      last_synced_at: _last_synced_at,
      localId: _localId,
      ...rawRecord
    } = record as Record<string, any>

    const finalPayload: Record<string, any> = {
      id: record.id,
      user_id: userId,
      client_updated_at: record.client_updated_at,
      deleted: record.deleted || false,
      version: record.version || 1,
      server_updated_at: new Date().toISOString()
    }

    if (!crypto.hasKey()) {
      console.error(`[SyncEngine] Unexpected state: vault locked during push for record:${record.id}`)
      await db.table('transactions').update(record.id, { sync_status: 'failed' })
      return null
    }

    const sensitiveData = this.cleanSensitiveData(rawRecord)
    const encrypted = await crypto.encrypt(JSON.stringify(sensitiveData))
    finalPayload.encrypted_payload = encrypted

    return finalPayload
  }

  private cleanSensitiveData(rawRecord: Record<string, any>): Record<string, any> {
    const sensitiveData: Record<string, any> = { ...rawRecord }
    const metadataFields = ['id', 'user_id', 'client_updated_at', 'server_updated_at', 'sync_status', 'deleted', 'version', 'syncStatus', 'is_dirty', 'last_modified_at']

    metadataFields.forEach(field => delete sensitiveData[field])

    Object.keys(sensitiveData).forEach((key) => {
      if (key.startsWith('_')) delete sensitiveData[key]
      if (key.endsWith('_id') && sensitiveData[key] === '') sensitiveData[key] = null
      if (typeof sensitiveData[key] === 'bigint') {
        sensitiveData[key] = BigIntAdapter.toString(sensitiveData[key] as bigint)
      }
    })

    return sensitiveData
  }

  private async handleDeletedRecord(
    table: any,
    tableName: string,
    recordId: string,
    _finalPayload: Record<string, any>
  ): Promise<void> {
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('id', recordId)

    if (!deleteError || deleteError.code === 'PGRST116') {
      await table.delete(recordId)
    } else {
      console.error(`[SyncEngine] Delete error in ${tableName}:${recordId}`, deleteError)
      await table.update(recordId, { sync_status: 'failed' })
    }
  }

  private async upsertRecord(
    table: any,
    tableName: string,
    recordId: string,
    finalPayload: Record<string, any>,
    userId: string
  ): Promise<void> {
    console.debug(`[SyncEngine] Pushing ${tableName}:${recordId}`, finalPayload)

    const { error: upsertError } = await supabase.from(tableName).upsert(
      finalPayload,
      { onConflict: 'id' },
    )

    if (!upsertError) {
      await table.update(recordId, {
        sync_status: 'synced',
        last_synced_at: new Date().toISOString(),
      })
      return
    }

    if (upsertError.code === 'PGRST204') {
      await this.handleSchemaMismatch(table, tableName, recordId, finalPayload, upsertError)
      return
    }

    await this.handleUpsertError(table, tableName, recordId, upsertError, finalPayload, userId)
  }

  private async handleSchemaMismatch(
    table: any,
    tableName: string,
    recordId: string,
    finalPayload: Record<string, any>,
    upsertError: any
  ): Promise<void> {
    const columnMatch = upsertError.message.match(/the '(\w+)' column/)
    if (!columnMatch) {
      console.error(`[SyncEngine] PGRST204 but couldn't extract column name for ${tableName}:${recordId}`, upsertError)
      await table.update(recordId, { sync_status: 'failed' })
      return
    }

    const unknownColumn = columnMatch[1]!
    console.warn(`[SyncEngine] Schema mismatch: stripping '${unknownColumn}' from ${tableName}:${recordId} payload and retrying.`)

    const strippedPayload = { ...finalPayload }
    delete (strippedPayload as Record<string, unknown>)[unknownColumn]

    const { error: retryError } = await supabase.from(tableName).upsert(
      strippedPayload,
      { onConflict: 'id' },
    )

    if (!retryError) {
      await table.update(recordId, {
        sync_status: 'synced',
        last_synced_at: new Date().toISOString(),
      })
    } else {
      console.error(`[SyncEngine] Retry failed for ${tableName}:${recordId}`, retryError)
      await table.update(recordId, { sync_status: 'failed' })
    }
  }

  private async handleUpsertError(
    table: any,
    tableName: string,
    recordId: string,
    upsertError: any,
    finalPayload: Record<string, any>,
    userId: string
  ): Promise<void> {
    console.error(`[SyncEngine] Upsert error in ${tableName}:${recordId}`, {
      code: upsertError.code,
      message: upsertError.message,
      details: upsertError.details,
      hint: upsertError.hint,
      payload: finalPayload,
      currentUser: userId
    })

    if (upsertError.code === '42501') {
      await this.handleRlsViolation(table, tableName, recordId, upsertError, userId)
    } else {
      await table.update(recordId, { sync_status: 'failed' })
    }
  }

  private async handleRlsViolation(
    table: any,
    tableName: string,
    recordId: string,
    upsertError: any,
    userId: string
  ): Promise<void> {
    const { data: sessionData } = await supabase.auth.getSession()
    console.error(`[SyncEngine] ⛔ RLS VIOLATION for ${tableName}:${recordId}`, {
      message: upsertError.message,
      payloadUserId: userId,
      authUserId: userId,
      sessionExists: !!sessionData?.session,
      sessionUserId: sessionData?.session?.user?.id,
      tokenExpiry: sessionData?.session?.expires_at
        ? new Date(sessionData.session.expires_at * 1000).toISOString()
        : 'N/A',
      userIdMatch: userId === sessionData?.session?.user?.id,
    })

    await table.update(recordId, { sync_status: 'failed' })
    console.warn(`[SyncEngine] Record ${tableName}:${recordId} marked as 'failed'. Check Supabase RLS policies for INSERT on table "${tableName}".`)
  }

  /**
   * Pulls all data from server that user has access to.
   */
  public async pullFromServer() {
    if (this.isPulling) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) return

    const user = await this.getAuthenticatedUser()
    if (!user) return

    this.isPulling = true
    const store = this.safeStore()
    let hasChanges = false

    try {
      for (const tableName of SYNCABLE_TABLES) {
        const hasTableChanges = await this.pullTable(tableName, user.id)
        if (hasTableChanges) hasChanges = true
      }

      if (hasChanges) {
        store?.notifyChange()
      }
    } catch (err) {
      this.handlePullError(err)
    } finally {
      this.isPulling = false
    }
  }

  private handlePullError(err: unknown): void {
    if (!(err instanceof Error && err.name === 'NavigatorLockAcquireTimeoutError')) {
      console.error('[SyncEngine] Pull failed:', err)
    }
  }

  private async pullTable(tableName: string, userId: string): Promise<boolean> {
    const table = db.table(tableName)
    const crypto = VaultCryptoManager.getInstance()

    const serverData = await this.fetchServerData(tableName, userId)
    if (!serverData) return false

    let hasChanges = false
    for (const item of serverData) {
      const isItemChanged = await this.processServerItem(table, tableName, item, crypto)
      if (isItemChanged) hasChanges = true
    }

    const areOrphansDeleted = await this.deleteOrphanRecords(table, serverData)
    if (areOrphansDeleted) hasChanges = true

    return hasChanges
  }

  private async fetchServerData(tableName: string, userId: string): Promise<any[] | null> {
    const { data: serverData, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error(`[SyncEngine] Error pulling from ${tableName}:`, error)
      return null
    }

    return serverData
  }

  private async processServerItem(
    table: any,
    tableName: string,
    item: any,
    crypto: VaultCryptoManager
  ): Promise<boolean> {
    const processedItem = await this.decryptPulledItem(item, tableName, crypto)
    const local = await table.get(item.id)

    if (!local) {
      await this.addNewLocalRecord(table, processedItem)
      return true
    }

    return await this.mergeExistingRecord(table, item, local, processedItem)
  }

  private async decryptPulledItem(
    item: any,
    tableName: string,
    crypto: VaultCryptoManager
  ): Promise<any> {
    if (!item.encrypted_payload || !crypto.hasKey()) {
      return { ...item }
    }

    try {
      const decrypted = await crypto.decrypt(item.encrypted_payload)
      const decryptedData = JSON.parse(decrypted)
      const processedItem = { ...item, ...decryptedData }
      delete processedItem.encrypted_payload
      return processedItem
    } catch (err) {
      console.error(`[SyncEngine] Failed to decrypt ${tableName}:${item.id}. Keeping encrypted.`, err)
      return { ...item }
    }
  }

  private async addNewLocalRecord(table: any, processedItem: any): Promise<void> {
    await table.add({
      ...processedItem,
      sync_status: 'synced',
      last_synced_at: new Date().toISOString(),
    })
  }

  private async mergeExistingRecord(
    table: any,
    serverItem: any,
    localRecord: any,
    processedItem: any
  ): Promise<boolean> {
    if (localRecord.sync_status === 'synced') {
      if (serverItem.server_updated_at !== localRecord.server_updated_at) {
        await this.updateLocalRecord(table, processedItem)
        return true
      }
      return false
    }

    const shouldApplyServer = this.shouldServerWin(serverItem, localRecord)
    if (shouldApplyServer) {
      await this.updateLocalRecord(table, processedItem)
      return true
    }

    return false
  }

  private shouldServerWin(serverItem: any, localRecord: any): boolean {
    const serverVersion = serverItem.version || 0
    const clientVersion = localRecord.version || 1

    if (serverVersion > clientVersion) return true
    if (serverVersion === clientVersion) {
      const serverTime = new Date(serverItem.client_updated_at).getTime()
      const clientTime = new Date(localRecord.client_updated_at).getTime()
      return serverTime > clientTime
    }

    return false
  }

  private async updateLocalRecord(table: any, processedItem: any): Promise<void> {
    await table.put({
      ...processedItem,
      sync_status: 'synced',
      last_synced_at: new Date().toISOString(),
    })
  }

  private async deleteOrphanRecords(table: any, serverData: any[]): Promise<boolean> {
    const localSynced = await table.where('sync_status').equals('synced').toArray()
    const serverIds = new Set(serverData.map((s) => s.id))

    const orphanIds: string[] = []
    for (const record of localSynced) {
      if (!serverIds.has(record.id)) {
        orphanIds.push(record.id)
      }
    }

    if (orphanIds.length > 0) {
      await table.bulkDelete(orphanIds)
      return true
    }

    return false
  }
}
