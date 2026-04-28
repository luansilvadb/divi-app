import type { SyncMetadata } from '@/shared/domain/entities/SyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalCategory extends SyncMetadata {
  name: string
  icon: string
  color: string
  parent_id?: string | null
}
