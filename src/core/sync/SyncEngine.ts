import { supabase } from '../supabase'
import { db, type DiviDatabase, type LocalSyncQueue } from '../db'
import { useSyncStore } from './syncStore'

export class SyncEngine {
  private isSyncing = false
  private syncTimeout: ReturnType<typeof setTimeout> | null = null
  private monitoredTables: (keyof DiviDatabase)[] = [
    'transactions',
    'wallets',
    'categories',
    'payees',
    'loans',
    'subscriptions',
    'budgets',
    'goals'
  ]

  // Configurações de Backoff
  private BASE_DELAY = 2000 // 2 segundos
  private MAX_DELAY = 1000 * 60 * 5 // 5 minutos

  constructor() {
    this.setupListeners()
  }

  private setupListeners() {
    // 1. Ganchos do Dexie para popular a fila de mutações
    this.monitoredTables.forEach(tableName => {
      const table = db.table(tableName as string)
      
      table.hook('creating', (primKey, obj) => {
        // Nova criação: payload completo, baseVersion = 0
        this.enqueue(tableName as string, primKey as string, 'create', obj, 0)
      })
      
      table.hook('updating', (mods, primKey, obj) => {
        // Atualização: ENVIAMOS APENAS O DELTA (mods) e a versão que conhecíamos
        this.enqueue(tableName as string, primKey as string, 'update', mods, obj.version || 1)
      })
      
      table.hook('deleting', (primKey, obj) => {
        this.enqueue(tableName as string, primKey as string, 'delete', { id: primKey }, obj.version || 1)
      })
    })

    // 2. Sincronizar ao iniciar a aplicação
    this.triggerSync()

    // 3. Listeners de Conectividade
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        useSyncStore().addLog({ status: 'success', message: 'Conexão restaurada' })
        this.triggerSync()
      })
      window.addEventListener('offline', () => {
        useSyncStore().addLog({ status: 'failed', message: 'Modo offline' })
      })
    }
  }

  /**
   * Adiciona uma mutação à fila
   */
  private async enqueue(
      table: string, 
      recordId: string, 
      action: 'create' | 'update' | 'delete', 
      payload: any,
      baseVersion: number
  ) {
    // Evitar loop infinito: não enfileirar se a mudança veio da própria sincronização
    if (payload.syncStatus === 'synced') return

    await db.sync_queue.add({
      table,
      recordId: String(recordId),
      action,
      payload: { ...payload },
      status: 'pending',
      attempts: 0,
      nextRetry: new Date().toISOString(),
      baseVersion,
      created_at: new Date().toISOString()
    })

    this.triggerSync()
  }

  public triggerSync() {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout)
    }

    this.syncTimeout = setTimeout(() => {
      this.processQueue()
    }, 1000)
  }

  /**
   * Processador da Fila de Mutações
   */
  private async processQueue() {
    if (this.isSyncing) return
    
    // Verificação de Internet
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return
    }

    const store = useSyncStore()
    const now = new Date().toISOString()

    // Atualiza contador inicial
    const totalPending = await db.sync_queue.count()
    store.setPendingCount(totalPending)

    // Busca itens pendentes que já podem ser re-tentados
    const queueItems = await db.sync_queue
      .where('nextRetry')
      .belowOrEqual(now)
      .sortBy('created_at')

    if (queueItems.length === 0) {
      store.setStatus('synced')
      return
    }

    this.isSyncing = true
    store.setStatus('syncing')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      for (const item of queueItems) {
        try {
          await this.processItem(item, user.id)
          // Sucesso: Remove da fila
          await db.sync_queue.delete(item.id!)
        } catch (error: any) {
          console.error(`[SyncEngine] Erro no item ${item.id}:`, error)
          
          const attempts = item.attempts + 1
          const delay = Math.min(this.BASE_DELAY * Math.pow(2, attempts), this.MAX_DELAY)
          const nextRetry = new Date(Date.now() + delay).toISOString()

          await db.sync_queue.update(item.id!, {
            attempts,
            nextRetry,
            status: 'failed',
            lastError: error.message || 'Erro desconhecido'
          })

          if (!navigator.onLine) break
        }
      }

      store.setLastSyncTime(new Date().toISOString())
      store.setStatus('synced')
    } catch (error) {
      console.error('[SyncEngine] Falha fatal no processamento da fila:', error)
      store.setStatus('failed')
    } finally {
      this.isSyncing = false
      const remaining = await db.sync_queue.count()
      store.setPendingCount(remaining)
      
      if (remaining > 0) {
        this.triggerSync()
      }
    }
  }

  /**
   * Processa um único item da fila usando RPC para lógica de merge no servidor
   */
  private async processItem(item: LocalSyncQueue, userId: string) {
    const { table, recordId, action, payload, baseVersion } = item

    // Limpeza de metadados locais antes do envio
    const cleanPayload = { ...payload }
    delete cleanPayload.localId
    delete cleanPayload._localId
    delete cleanPayload.syncStatus
    delete cleanPayload._syncStatus
    delete cleanPayload.version // A versão é controlada pelo campo baseVersion no RPC
    cleanPayload.user_id = userId

    // Chamar a função handled_sync no Supabase
    const { data: result, error } = await supabase.rpc('handled_sync', {
      p_table_name: table,
      p_record_id: recordId,
      p_action: action,
      p_payload: cleanPayload,
      p_base_version: baseVersion
    })

    if (error) throw error

    // Sincroniza o resultado de volta para o local (Merge com o que o servidor decidiu)
    if (result) {
        const key = table === 'transactions' ? { localId: Number(recordId) } : recordId
        await (db as any)[table].update(key, { 
            ...result,
            syncStatus: 'synced' 
        })
    }
  }
}

const syncEngine = new SyncEngine()
export { syncEngine }
export default syncEngine
