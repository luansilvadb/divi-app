import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { ICategoryRepository } from '@/shared/domain/contracts/ICategoryRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import type { Category } from '@/shared/domain/entities/Category'
import { db, type LocalTransaction, type LocalWallet, type LocalCategory } from '@/core/db'
import { supabase } from '@/core/supabase'
import { InfrastructureError } from '../../domain/errors'

export class DexieSupabaseTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    try {
      const list = await db.transactions.toArray()
      return list.map((item) => this.mapToEntity(item))
    } catch (err) {
      throw new InfrastructureError('Failed to get all transactions from local DB', err)
    }
  }

  async getByMonth(year: number, month: number): Promise<Transaction[]> {
    try {
      const start = new Date(year, month - 1, 1).toISOString()
      const end = new Date(year, month, 0, 23, 59, 59).toISOString()

      const list = await db.transactions
        .where('date')
        .between(start, end)
        .and((t) => !t.deleted)
        .toArray()

      return list.map((item) => this.mapToEntity(item))
    } catch (err) {
      throw new InfrastructureError('Failed to get transactions by month from local DB', err)
    }
  }

  async save(transaction: Transaction): Promise<void> {
    try {
      const now = new Date().toISOString()
      const localData: LocalTransaction = {
        ...transaction,
        synced: false,
        updated_at: now,
      }

      if (transaction.localId) {
        await db.transactions.put(localData)
      } else {
        await db.transactions.add(localData)
      }

      // Attempt background sync
      this.sync().catch((err) => console.error('[TransactionSync] Background sync error', err))
    } catch (err) {
      throw new InfrastructureError('Failed to save transaction to local DB', err)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Soft delete locally
      await db.transactions.where('id').equals(id).modify({ deleted: true, synced: false })
      this.sync().catch((err) => console.error('[TransactionSync] Background sync error', err))
    } catch (err) {
      throw new InfrastructureError('Failed to delete transaction', err)
    }
  }

  async sync(): Promise<void> {
    try {
      const unsynced = await db.transactions.where('synced').equals(0).toArray()
      if (unsynced.length === 0) return

      const toDelete = unsynced.filter((item) => item.deleted && item.id)
      const toUpsert = unsynced.filter((item) => !item.deleted)

      // Bulk Delete
      if (toDelete.length > 0) {
        const deleteIds = toDelete.map((i) => i.id as string)
        const { error } = await supabase.from('transactions').delete().in('id', deleteIds)

        if (!error) {
          const localDeleteIds = toDelete.map((i) => i.localId as number)
          await db.transactions.bulkDelete(localDeleteIds)
        } else {
          throw new InfrastructureError('[Sync] Bulk delete failed', error)
        }
      }

      // Bulk Upsert
      if (toUpsert.length > 0) {
        const upsertPayload = toUpsert.map((item) => ({
          id: item.id,
          title: item.title,
          amount: item.amount,
          type: item.type,
          date: item.date,
          category_id: item.category_id,
          wallet_id: item.wallet_id,
          payee_id: item.payee_id,
          user_id: item.user_id,
          notes: item.notes,
          updated_at: item.updated_at,
        }))

        const { data, error } = await supabase
          .from('transactions')
          .upsert(upsertPayload)
          .select('id')

        if (error) {
          throw new InfrastructureError('[Sync] Bulk upsert failed', error)
        }

        if (data) {
          // Find which local records got synced and update their status
          const updates = toUpsert
            .map((item) => {
              const remoteRecord = data.find((d: Record<string, unknown>) => d.id === item.id)
              if (remoteRecord) {
                return {
                  key: item.localId,
                  changes: {
                    id: remoteRecord.id as string,
                    synced: true,
                  },
                }
              }
              return null
            })
            .filter(Boolean) as { key: number; changes: Record<string, unknown> }[]

          // Utilizando bulkPut/bulkGet em lote para evitar gargalos bloqueantes de I/O em loops
          const keysToUpdate = updates.map((u) => Number(u.key))
          await db.transaction('rw', db.transactions, async () => {
            const records = await db.transactions.bulkGet(keysToUpdate)
            const validRecords = records.reduce((acc, record, i) => {
              if (record) {
                acc.push({ ...record, ...updates[i]?.changes } as LocalTransaction)
              }
              return acc
            }, [] as LocalTransaction[])

            if (validRecords.length > 0) {
              await db.transactions.bulkPut(validRecords)
            }
          })
        }
      }
    } catch (err) {
      if (err instanceof InfrastructureError) throw err
      throw new InfrastructureError('Sync process failed', err)
    }
  }

  private mapToEntity(
    item: LocalTransaction,
  ): Transaction & { _titleLower?: string; _timestamp?: number; _dateKey?: string } {
    const t = {
      ...(item as unknown as Transaction),
      synced: !!item.synced,
      deleted: !!item.deleted,
    }
    // Pre-calculate derivations to optimize UI rendering
    return {
      ...t,
      _titleLower: t.title.toLowerCase(),
      _timestamp: new Date(t.date).getTime(),
      _dateKey: t.date.substring(0, 10),
    }
  }
}

export class DexieWalletRepository implements IWalletRepository {
  async getAll(): Promise<Wallet[]> {
    try {
      const list = await db.wallets.toArray()
      return list as Wallet[]
    } catch (err) {
      throw new InfrastructureError('Failed to get wallets from local DB', err)
    }
  }

  async save(wallet: Wallet): Promise<void> {
    try {
      await db.wallets.put({ ...wallet, synced: false } as LocalWallet)
    } catch (err) {
      throw new InfrastructureError('Failed to save wallet to local DB', err)
    }
  }

  async getById(id: string): Promise<Wallet | null> {
    try {
      const w = await db.wallets.get(id)
      return w ? (w as Wallet) : null
    } catch (err) {
      throw new InfrastructureError('Failed to get wallet by ID from local DB', err)
    }
  }
}

export class DexieCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    try {
      const list = await db.categories.toArray()
      return list as Category[]
    } catch (err) {
      throw new InfrastructureError('Failed to get categories from local DB', err)
    }
  }

  async save(category: Category): Promise<void> {
    try {
      await db.categories.put({ ...category, synced: false } as LocalCategory)
    } catch (err) {
      throw new InfrastructureError('Failed to save category to local DB', err)
    }
  }
}
