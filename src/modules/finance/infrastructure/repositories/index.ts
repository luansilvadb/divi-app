import type {
  ITransactionRepository,
  IWalletRepository,
  ICategoryRepository,
} from '../../domain/repositories'
import type { Transaction, Wallet, Category } from '../../domain/entities'
import {
  db,
  type LocalTransaction,
  type LocalWallet,
  type LocalCategory,
} from '../../../../core/db'
import { supabase } from '../../../../core/supabase'

export class DexieSupabaseTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    const list = await db.transactions.toArray()
    // Map local DB format to Domain Entity
    return list.map((item) => this.mapToEntity(item))
  }

  async getByMonth(year: number, month: number): Promise<Transaction[]> {
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 0, 23, 59, 59).toISOString()

    const list = await db.transactions
      .where('date')
      .between(start, end)
      .and((t) => !t.deleted)
      .toArray()

    return list.map((item) => this.mapToEntity(item))
  }

  async save(transaction: Transaction): Promise<void> {
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
    this.sync().catch(console.error)
  }

  async delete(id: string): Promise<void> {
    // Soft delete locally
    await db.transactions.where('id').equals(id).modify({ deleted: true, synced: false })
    this.sync().catch(console.error)
  }

  async sync(): Promise<void> {
    const unsynced = await db.transactions.where('synced').equals(0).toArray()
    if (unsynced.length === 0) return

    const toDelete = unsynced.filter((item) => item.deleted && item.id)
    const toUpsert = unsynced.filter((item) => !item.deleted)

    // Bulk Delete
    if (toDelete.length > 0) {
      const deleteIds = toDelete.map((i) => i.id as string)
      const { error } = await supabase.from('transactions').delete().in('id', deleteIds)

      if (!error) {
        const localDeleteIds = toDelete.map((i) => i.localId as string)
        await db.transactions.bulkDelete(localDeleteIds)
      } else {
        console.error('[Sync] Bulk delete failed', error)
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

      const { data, error } = await supabase.from('transactions').upsert(upsertPayload).select('id')

      if (!error && data) {
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
          .filter(Boolean) as { key: string; changes: Record<string, unknown> }[]

        // Utilizando bulkPut/bulkGet em lote para evitar gargalos bloqueantes de I/O em loops
        const keysToUpdate = updates.map((u) => u.key as string)
        await db.transaction('rw', db.transactions, async () => {
          const records = await db.transactions.bulkGet(keysToUpdate)
          const validRecords = records.reduce(
            (acc, record, i) => {
              if (record) {
                acc.push({ ...record, ...updates[i]?.changes })
              }
              return acc
            },
            [] as Record<string, unknown>[],
          )

          if (validRecords.length > 0) {
            await db.transactions.bulkPut(validRecords)
          }
        })
      } else {
        console.error('[Sync] Bulk upsert failed', error)
      }
    }
  }

  private mapToEntity(item: LocalTransaction): Transaction {
    return {
      ...(item as unknown as Transaction),
      synced: !!item.synced,
      deleted: !!item.deleted,
    }
  }
}

export class DexieWalletRepository implements IWalletRepository {
  async getAll(): Promise<Wallet[]> {
    const list = await db.wallets.toArray()
    return list as Wallet[]
  }

  async save(wallet: Wallet): Promise<void> {
    await db.wallets.put({ ...wallet, synced: false } as LocalWallet)
  }

  async getById(id: string): Promise<Wallet | null> {
    const w = await db.wallets.get(id)
    return w ? (w as Wallet) : null
  }
}

export class DexieCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    const list = await db.categories.toArray()
    return list as Category[]
  }

  async save(category: Category): Promise<void> {
    await db.categories.put({ ...category, synced: false } as LocalCategory)
  }
}
