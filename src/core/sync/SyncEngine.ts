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
        this.enqueue(tableName as string, primKey as string, 'create', obj)
      })
      
      table.hook('updating', (mods, primKey, obj) => {
        // Mesclamos as mudanças com o objeto original para ter o estado final completo
        const finalObj = { ...obj, ...mods }
        this.enqueue(tableName as string, primKey as string, 'update', finalObj)
      })
      
      table.hook('deleting', (primKey) => {
        this.enqueue(tableName as string, primKey as string, 'delete', { id: primKey })
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
  private async enqueue(table: string, recordId: string, action: 'create' | 'update' | 'delete', payload: any) {
    // Evitar loop infinito: não enfileirar se a mudança veio da própria sincronização (syncStatus === 'synced')
    if (payload.syncStatus === 'synced') return

    await db.sync_queue.add({
      table,
      recordId: String(recordId),
      action,
      payload: { ...payload },
      status: 'pending',
      attempts: 0,
      nextRetry: new Date().toISOString(),
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
    console.log(`[SyncEngine] Processando fila: ${queueItems.length} itens encontrados.`)

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
          
          // Falha: Aplica Backoff Exponencial
          const attempts = item.attempts + 1
          const delay = Math.min(this.BASE_DELAY * Math.pow(2, attempts), this.MAX_DELAY)
          const nextRetry = new Date(Date.now() + delay).toISOString()

          await db.sync_queue.update(item.id!, {
            attempts,
            nextRetry,
            status: 'failed',
            lastError: error.message || 'Erro desconhecido'
          })

          // Se falhou por rede, interrompe o loop para não queimar tentativas dos outros
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
      // Atualiza contador final e agenda nova verificação
      const remaining = await db.sync_queue.count()
      store.setPendingCount(remaining)
      
      if (remaining > 0) {
        this.triggerSync()
      }
    }
  }

  /**
   * Processa um único item da fila
   */
  private async processItem(item: LocalSyncQueue, userId: string) {
    const { table, recordId, action, payload } = item
    const supabaseTable = supabase.from(table)

    // Limpeza de dados para o Supabase
    const cleanData = { ...payload }
    delete cleanData.localId
    delete cleanData._localId
    delete cleanData.syncStatus
    delete cleanData._syncStatus
    cleanData.user_id = userId

    // Garantir que UUIDs vazios não causem erro de cast no Postgres
    for (const key of Object.keys(cleanData)) {
      if (cleanData[key] === '' && (key.endsWith('_id') || key === 'id')) {
        delete cleanData[key]
      }
    }

    if (action === 'delete') {
      const { error } = await supabaseTable.delete().eq('id', recordId)
      if (error) throw error
    } else {
      // Create ou Update: Usamos UPSERT com resolução básica de conflitos
      // Nota: Em um nível ainda mais avançado, checaríamos a versão remota aqui.
      const { error, data } = await supabaseTable.upsert(cleanData).select().single()
      
      if (error) {
          // Se o erro for de conflito (ex: 409), poderíamos implementar lógica de merge aqui
          throw error
      }

      // Sincroniza o ID remoto de volta para o local se for um registro novo
      if (data && data.id) {
         const key = table === 'transactions' ? { localId: Number(recordId) } : recordId
         await (db as any)[table].update(key, { 
             id: data.id, 
             syncStatus: 'synced' 
         })
      } else {
         const key = table === 'transactions' ? { localId: Number(recordId) } : recordId
         await (db as any)[table].update(key, { 
             syncStatus: 'synced' 
         })
      }
    }
  }
}

const syncEngine = new SyncEngine()
export { syncEngine }
export default syncEngine
