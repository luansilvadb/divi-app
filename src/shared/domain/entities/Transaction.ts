import type { SyncMetadata } from './SyncMetadata'

export interface Transaction extends SyncMetadata {
  localId?: string // for Dexie
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category_id: string
  wallet_id: string
  payee_id?: string
  notes?: string
}

