import type { SyncMetadata } from './SyncMetadata'

export interface Wallet extends SyncMetadata {
  name: string
  balance: bigint
  currency: string
  type: string
  icon?: string
  color?: string
}
