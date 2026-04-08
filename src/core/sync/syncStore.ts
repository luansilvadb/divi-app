import { defineStore } from 'pinia'

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'synced' | 'pending' | 'failed'

export interface SyncLog {
  id: string
  timestamp: string
  status: 'success' | 'failed' | 'pending'
  message: string
  details?: Record<string, unknown>
}

export const useSyncStore = defineStore('sync', {
  state: () => ({
    status: 'synced' as SyncStatus,
    lastSyncTime: null as string | null,
    pendingCount: 0,
    fatalErrorCount: 0,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    error: null as string | null,
    logs: [] as SyncLog[]
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
    setFatalErrorCount(count: number) {
      this.fatalErrorCount = count
    },
    setOnlineStatus(isOnline: boolean) {
      this.isOnline = isOnline
      this.status = isOnline ? (this.pendingCount > 0 ? 'pending' : 'synced') : 'offline'
    },
    setError(error: string | null) {
      this.error = error
    },
    addLog(log: Omit<SyncLog, 'id' | 'timestamp'>) {
      const newLog: SyncLog = {
        ...log,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }
      this.logs.unshift(newLog)
      // Keep only last 50 logs
      if (this.logs.length > 50) {
        this.logs = this.logs.slice(0, 50)
      }
    },
    clearLogs() {
      this.logs = []
    }
  }
})
