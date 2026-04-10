/**
 * Utilitário para carregamento, validação e sanitização de ativos visuais.
 */
export interface IAssetLoader {
  /**
   * Sanitiza e valida uma URL de ativo (Data URI ou Static Path).
   * Retorna a URL sanitizada ou um fallback seguro.
   */
  sanitize(url: string | undefined): string

  /**
   * Verifica se uma Data URI excede o limite de tamanho permitido.
   */
  isValidSize(dataUri: string): boolean

  /**
   * Obtém um fallback padrão baseado no tipo de recurso.
   */
  getFallback(type?: 'category' | 'wallet' | 'generic'): string
}

