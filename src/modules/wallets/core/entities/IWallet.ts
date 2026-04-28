import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

export interface IWallet extends ISyncMetadata {
  name: string
  balance: bigint
  currency: string
  type: string
  icon?: string
  color?: string
}
