/**
 * Representa um recurso visual dinâmico ou estático utilizado na interface.
 */
export interface Asset {
  type: 'data' | 'static' | 'icon'
  value: string
  fallback?: string
  metadata?: {
    mimeType?: string
    size?: number
    lastModified?: number
  }
}

export const ASSET_LIMITS = {
  MAX_DATA_URI_SIZE: 128 * 1024, // 128KB
  ALLOWED_PROTOCOLS: ['data:', '/'],
}
