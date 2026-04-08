import { supabase } from '../supabase'
import { db, type DiviDatabase } from '../db'
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

  constructor() {
    this.setupListeners()
  }

  private setupListeners() {
    // 1. Sincronização em tempo real baseada em eventos do banco local (Dexie Hooks)
    this.monitoredTables.forEach(tableName => {
      const table = db.table(tableName as string)
      table.hook('creating', () => this.triggerSync())
      table.hook('updating', () => this.triggerSync())
      table.hook('deleting', () => this.triggerSync())
    })

    // 2. Sincronizar ao iniciar a aplicação
    this.triggerSync()

    // 3. Sincronizar ao restaurar conexão
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

  private startAutoSync() {
    this.triggerSync()
  }

  public triggerSync() {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout)
    }

    this.syncTimeout = setTimeout(async () => {
      try {
        await this.sync()
      } catch (error) {
        console.error('[SyncEngine] Auto-sync failed:', error)
      } finally {
        this.isSyncing = false
      }
    }, 1000) // Debounce para agregamento de chamadas (1 segundo)
  }

  /**
   * Obtém todos os registros pendentes de todas as tabelas monitoradas
   */
  public async getPendingRecords() {
    const allPending: { table: keyof DiviDatabase; data: any }[] = []

    for (const table of this.monitoredTables) {
      // Ignorar tabelas que não são sincronizáveis ou de log
      if (table === 'activities') continue

      const pending = await (db as any)[table]
        .where('syncStatus')
        .equals('pending')
        .toArray()
      
      const failed = await (db as any)[table]
        .where('syncStatus')
        .equals('failed')
        .toArray()

      const toSync = [...pending, ...failed]
      
      for (const item of toSync) {
        allPending.push({ table, data: item })
      }
    }

    return allPending
  }

  /**
   * Executa o ciclo de sincronização
   */
  async sync(): Promise<void> {
    const store = useSyncStore()

    if (this.isSyncing) return
    this.isSyncing = true
    store.setStatus('syncing')

    try {
      const pendingRecords = await this.getPendingRecords()
      
      if (pendingRecords.length === 0) {
        console.log('[SyncEngine] No pending records.')
        store.setStatus('synced')
        return
      }

      console.log(`[SyncEngine] Found ${pendingRecords.length} pending records.`)
      store.addLog({
        status: 'pending',
        message: `Iniciando sincronização de ${pendingRecords.length} registros.`
      })

      // Agrupar por tabela para otimizar upserts
      const grouped = pendingRecords.reduce((acc, curr) => {
        const table = curr.table
        if (!acc[table]) acc[table] = []
        acc[table]?.push(curr.data)
        return acc
      }, {} as Record<string, any[]>)

      for (const [table, records] of Object.entries(grouped)) {
        await this.syncTableRecords(table as keyof DiviDatabase, records)
      }

      store.setStatus('synced')
      store.setLastSyncTime(new Date().toISOString())
      store.addLog({
        status: 'success',
        message: 'Sincronização concluída com sucesso.'
      })
    } catch (error: any) {
      store.setStatus('failed')
      store.addLog({
        status: 'failed',
        message: `Erro na sincronização: ${error.message || 'Erro desconhecido'}`,
        details: typeof error === 'object' ? error : { error: String(error) }
      })
      console.error('[SyncEngine] Sync error:', error)
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Sincroniza registros de uma tabela específica
   */
  private async syncTableRecords(table: keyof DiviDatabase, records: any[]) {
    const store = useSyncStore()
    try {
      // 1. Lidar com registros deletados (se existirem)
      const toDelete = records.filter(r => r.deleted && r.id)
      if (toDelete.length > 0) {
        const { error } = await supabase
          .from(table)
          .delete()
          .in('id', toDelete.map(r => r.id))

        if (error) {
          console.error(`[SyncEngine] Delete error for ${table}:`, error)
          store.addLog({
            status: 'failed',
            message: `Erro ao deletar em ${table}`,
            details: error as any
          })
          throw error
        }
        
        for (const record of toDelete) {
          const key = table === 'transactions' ? record.localId : record.id;
          if (key) {
            await (db as any)[table].delete(key);
          }
        }
      }

      // 2. Upsert (Inserir ou Atualizar) registros ativos
      const toUpsert = records.filter(r => !r.deleted)
      if (toUpsert.length > 0) {
        // Obter user_id diretamente do Supabase para garantir sincronia com a sessão
        const { data: { user } } = await supabase.auth.getUser()
        
        // 2.1 Fetch remote records for LWW conflict resolution
        const remoteIds = toUpsert.map(r => r.id).filter(Boolean);
        let remoteRecords: any[] = [];
        if (remoteIds.length > 0) {
          const { data } = await supabase.from(table).select('*').in('id', remoteIds);
          if (data) remoteRecords = data;
        }

        // 2.2 Resolve conflicts using LWW
        const resolvedToUpsert = [];
        for (const localRecord of toUpsert) {
          if (!localRecord.id) {
            resolvedToUpsert.push(localRecord);
            continue;
          }
          const remoteMatched = remoteRecords.find(r => r.id === localRecord.id);
          if (remoteMatched && remoteMatched.updated_at && localRecord.updated_at) {
            const remoteTime = new Date(remoteMatched.updated_at).getTime();
            const localTime = new Date(localRecord.updated_at).getTime();
            if (remoteTime > localTime) {
              const key = table === 'transactions' ? localRecord.localId : localRecord.id;
              if (key) {
                await (db as any)[table].update(key, { ...remoteMatched, syncStatus: 'synced' });
              }
              continue; // Skip upsert
            }
          }
          resolvedToUpsert.push(localRecord);
        }

        if (resolvedToUpsert.length === 0) return;

        // Prepare data (remove dexie-only fields like localId, syncStatus)
        const cleanData = resolvedToUpsert.map(r => {
          const { localId: _localId, syncStatus: _syncStatus, ...rest } = r as any
          
          // Forçar user_id se estiver faltando ou for diferente do usuário logado
          if (user?.id) {
            rest.user_id = user.id
          }

          // Remove empty strings ONLY from UUID fields to avoid "invalid input syntax for type uuid"
          // String fields like 'title' should stay even if empty to avoid NOT NULL violations if not handled by DB defaults
          const result: any = { ...rest }
          for (const key of Object.keys(result)) {
            if (result[key] === '' && (key.endsWith('_id') || key === 'id')) {
              delete result[key]
            }
          }
          return result
        })

        const { data: upsertedData, error } = await supabase
          .from(table)
          .upsert(cleanData)
          .select()

        if (error) {
          console.error(`[SyncEngine] Upsert error for ${table}:`, error)
          store.addLog({
            status: 'failed',
            message: `Erro ao subir dados para ${table}: ${error.message}`,
            details: error as any
          })
          throw error
        }

        // Mark as synced locally
        for (let i = 0; i < toUpsert.length; i++) {
          const record = toUpsert[i];
          const remoteRecord = upsertedData ? upsertedData[i] : null;
          const key = table === 'transactions' ? record.localId : record.id;
          
          if (key) {
            const updates: any = { syncStatus: 'synced' };
            if (remoteRecord && remoteRecord.id && !record.id) {
              updates.id = remoteRecord.id;
            }
            await (db as any)[table].update(key, updates);
          }
        }
      }
    } catch (error) {
      // Mark as failed locally so we can retry later
      for (const record of records) {
        const key = table === 'transactions' ? record.localId : record.id;
        if (key) {
          await (db as any)[table].update(key, { syncStatus: 'failed' })
        }
      }
      throw error
    }
  }
}

const syncEngine = new SyncEngine()
export { syncEngine }
export default syncEngine
