/**
 * Base status for Local-First synchronization.
 */
export type SyncStatus = 'synced' | 'pending' | 'failed'

/**
 * Standard metadata for any entity that participates in the SyncEngine.
 */
export interface ISyncMetadata {
  id: string
  user_id: string
  sync_status: SyncStatus
  client_updated_at: string
  created_at: string
  version: number
  deleted: boolean
  last_synced_at?: string
  server_updated_at?: string
}
