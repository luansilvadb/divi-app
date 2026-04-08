import type { SyncMetadata } from './SyncMetadata'

export interface Category extends SyncMetadata {
  name: string
  icon?: string
  color?: string
}
