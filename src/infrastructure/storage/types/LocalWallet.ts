import type { SyncMetadata } from '@/shared/domain/entities/SyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalWallet extends SyncMetadata {
  name: string
  balance: bigint
  currency: string
  type: string
}
