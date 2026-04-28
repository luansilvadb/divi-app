/**
 * Serviço para gerenciar a persistência do armazenamento no navegador.
 * Solicita ao browser que os dados não sejam excluídos automaticamente em situações de pouco espaço.
 */
class PersistenceService {
  /**
   * Verifica se o armazenamento já é persistente ou solicita permissão para torná-lo.
   * @returns Promise<boolean> True se a persistência estiver garantida.
   */
  async ensurePersistence(): Promise<boolean> {
    if (!navigator.storage || !navigator.storage.persist) {
      console.warn('[PersistenceService] Storage API not supported in this browser.')
      return false
    }

    let isPersisted = await navigator.storage.persisted()
    console.debug(`[PersistenceService] Current persistence status: ${isPersisted}`)

    if (!isPersisted) {
      isPersisted = await navigator.storage.persist()
      console.info(`[PersistenceService] Requested persistence. New status: ${isPersisted}`)
    }

    return isPersisted
  }

  /**
   * Obtém informações sobre a cota de armazenamento disponível.
   */
  async getStorageEstimate() {
    if (!navigator.storage || !navigator.storage.estimate) return null
    return await navigator.storage.estimate()
  }
}

export const persistenceService = new PersistenceService()
