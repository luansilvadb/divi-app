import type { SyncMetadata } from './SyncMetadata'

export interface Wallet extends SyncMetadata {
  name: string
  balance: number
  currency: string
  icon?: string
}
