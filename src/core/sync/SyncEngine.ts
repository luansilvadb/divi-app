import { supabase } from '../supabase'
import { db } from '../db'
import { useSyncStore } from './syncStore'

export class SyncEngine {
  private static instance: SyncEngine
  private isPushing = false

  constructor() {
    SyncEngine.instance = this
    // No auto-init in tests
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

  /** Exclusivo para testes */
  public static _resetInstance() {
    (SyncEngine as any).instance = undefined
  }

  private init() {
    // 1. Pequeno delay no boot para o Pinia respirar
    setTimeout(() => {
      this.pushDirtyRecords()
      this.pullFromServer() // <- Já puxa no boot!
    }, 1000)

    // 2. Listeners de sistema (Ouvindo a volta da internet)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.safeStore()?.setOnlineStatus(true)
        this.pushDirtyRecords()
        this.pullFromServer() // <- Puxa novidades ao voltar rede
      })
      window.addEventListener('offline', () => {
        this.safeStore()?.setOnlineStatus(false)
      })
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.pushDirtyRecords()
          this.pullFromServer() // <- Puxa ao voltar foco (alt+tab)
        }
      })
    }
  }

  /**
   * Helper para acessar a store sem quebrar o boot
   */
  private safeStore() {
    try {
      return useSyncStore()
    } catch {
      return null
    }
  }

  /**
   * O Tubo Direto: Pega o que está sujo (1) e joga na nuvem
   */
  public async pushDirtyRecords() {
    if (this.isPushing) return
    if (typeof navigator !== 'undefined' && !navigator.onLine) return

    this.isPushing = true
    const store = this.safeStore()
    console.log('[SyncEngine] Verificando dados pendentes para subir...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      store?.setStatus('syncing')

      const tables = ['transactions', 'wallets', 'categories'] as const
      
      for (const tableName of tables) {
        const table = db.table(tableName)
        
        // 1. Busca o que está pendente no Dexie (is_dirty === 1)
        const dirtyRecords = await table.where('is_dirty').equals(1).toArray()
        
        if (dirtyRecords.length === 0) continue

        // SEPARAÇÃO: Upserts e Deletes
        const toDelete = dirtyRecords.filter(r => r.deleted === true)
        const toUpsert = dirtyRecords.filter(r => !r.deleted)

        // 1. PROCESSAR UPSERTS (Novos e Editados)
        if (toUpsert.length > 0) {
          console.log(`[SyncEngine] Upsert de ${toUpsert.length} itens em ${tableName}...`)
          const payload = toUpsert.map(record => {
            const { localId: _l, is_dirty: _d, syncStatus: _s, last_modified_at: _m, ...cleanData } = record as any
            
            // Sanitização UUID
            Object.keys(cleanData).forEach(key => {
              if ((key === 'id' || key.endsWith('_id')) && cleanData[key] === '') {
                cleanData[key] = null
              }
            })

            return { ...cleanData, user_id: user.id, updated_at: new Date().toISOString() }
          })

          const { error } = await supabase.from(tableName).upsert(payload, { onConflict: 'id' })
          
          if (!error) {
            const ids = toUpsert.map(r => r.id)
            await table.where('id').anyOf(ids).modify({ 
              is_dirty: 0, 
              syncStatus: 'synced' 
            })
          } else {
            console.error(`[SyncEngine] Erro Upsert ${tableName}:`, error.message)
            const ids = toUpsert.map(r => r.id)
            await table.where('id').anyOf(ids).modify({ syncStatus: 'failed' })
          }
        }

        // 2. PROCESSAR DELETES (Expurgo Físico na Nuvem)
        if (toDelete.length > 0) {
          console.log(`[SyncEngine] Deletando ${toDelete.length} itens do Supabase em ${tableName}...`)
          const idsToRemove = toDelete.map(r => r.id)
          
          const { error } = await supabase
            .from(tableName)
            .delete()
            .in('id', idsToRemove)

          if (!error) {
            // Remocão física local APENAS APÓS sucesso remoto
            await table.where('id').anyOf(idsToRemove).delete()
            console.log(`[SyncEngine] ✅ Itens removidos do Supabase e do banco local!`)
          } else {
            console.error(`[SyncEngine] Erro ao deletar no Supabase:`, error.message)
            // Se falhou por RLS ou rede, mantém local como dirty para tentar de novo
            await table.where('id').anyOf(idsToRemove).modify({ syncStatus: 'failed' })
          }
        }
        
        console.log(`[SyncEngine] ✅ ${tableName} sincronizado!`)
      }
      
      store?.setStatus('synced')
      store?.setLastSyncTime(new Date().toISOString())
    } catch (err) {
      console.error('[SyncEngine] Falha no fluxo de push:', err)
      store?.setStatus('failed')
    } finally {
      this.isPushing = false
    }
  }

  // Atalho para ser chamado pelos repositórios após um save local
  public trigger() {
    this.pushDirtyRecords()
  }

  /**
   * PULL BÁSICO: Traz o que está no servidor para o local
   */
  public async pullFromServer() {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      for (const tableName of ['transactions', 'wallets', 'categories'] as const) {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', user.id)

        if (error || !data) continue

        const table = db.table(tableName)
        
        // 1. Aplicar atualizações do servidor
        for (const item of data) {
           const local = await table.where('id').equals(item.id).first()
           if (!local || local.is_dirty === 0) {
              const localId = (local as any)?.localId
              const updatedId = await table.put({ ...item, localId, is_dirty: 0, syncStatus: 'synced' })
              
              // LIMPEZA DE CLONES: Garante que não existam outros registros com o mesmo ID UUID
              await table.where('id').equals(item.id).and(r => r.localId !== updatedId).delete()
           }
        }

        // 2. DETECTOR DE FANTASMAS (Limpar o que sumiu do Supabase)
        // Pedimos apenas os IDs para ser leve
        const { data: serverIds, error: idError } = await supabase
          .from(tableName)
          .select('id')
          .eq('user_id', user.id)

        if (!idError && serverIds) {
          const serverIdSet = new Set(serverIds.map(s => s.id))
          const localSynced = await table.where('is_dirty').equals(0).toArray()
          
          const orphans = localSynced.filter(r => !serverIdSet.has(r.id))
          if (orphans.length > 0) {
            console.log(`[SyncEngine] Removendo ${orphans.length} fantasmas em ${tableName}...`)
            await table.where('id').anyOf(orphans.map(o => o.id)).delete()
          }
        }
      }
      // 3. Notificar UI de que dados mudaram (Reconciliação concluída)
      this.safeStore()?.notifyChange()
    } catch (err) {
      console.error('[SyncEngine] Erro no pull manual:', err)
    }
  }
}

export default SyncEngine
