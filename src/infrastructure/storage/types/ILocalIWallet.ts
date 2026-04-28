import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface ILocalIWallet extends ISyncMetadata {
  name: string
  balance: bigint
  currency: string
  type: string
}
