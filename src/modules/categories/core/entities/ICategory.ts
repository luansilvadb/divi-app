import type { ISyncMetadata } from '@/shared/domain/ISyncMetadata'

export interface ICategory extends ISyncMetadata {
  name: string
  icon: string
  color: string
  parent_id?: string | null
}
