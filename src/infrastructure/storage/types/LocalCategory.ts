import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

/**
 * @deprecated Use domain entities instead.
 * Transitionally keeping this here until all modules are fully FSD-aligned.
 */
export interface LocalCategory extends ISyncMetadata {
  name: string
  icon: string
  color: string
  parent_id?: string | null
}
