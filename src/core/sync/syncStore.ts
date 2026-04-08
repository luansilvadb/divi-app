import { defineStore } from 'pinia'

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'synced' | 'pending' | 'failed'

export const useSyncStore = defineStore('sync', {
  state: () => ({
    status: 'synced' as SyncStatus,
    lastSyncTime: null as string | null,
    pendingCount: 0,
    error: null as string | null
  }),
  actions: {
    setStatus(status: SyncStatus) {
      this.status = status
    },
    setLastSyncTime(time: string) {
      this.lastSyncTime = time
    },
    setPendingCount(count: number) {
      this.pendingCount = count
    },
    setError(error: string | null) {
      this.error = error
    }
  }
})
