import type { ITransactionRepository, IWalletRepository, ICategoryRepository } from '../../domain/repositories'
import type { Transaction, Wallet, Category } from '../../domain/entities'
import { db, type LocalTransaction, type LocalWallet, type LocalCategory } from '../../../../core/db'
import { supabase } from '../../../../core/supabase'

export class DexieSupabaseTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    const list = await db.transactions.toArray()
    return list.map(item => this.mapToEntity(item))
  }

  async getByMonth(year: number, month: number): Promise<Transaction[]> {
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 0, 23, 59, 59).toISOString()
    const list = await db.transactions.where('date').between(start, end).and(t => !t.deleted).toArray()
    return list.map(item => this.mapToEntity(item))
  }

  async save(transaction: Transaction): Promise<void> {
    const localData: LocalTransaction = { ...transaction, synced: false, updated_at: new Date().toISOString() }
    if (transaction.localId) await db.transactions.put(localData)
    else await db.transactions.add(localData)
    this.sync().catch(console.error)
  }

  async delete(id: string): Promise<void> {
    await db.transactions.where('id').equals(id).modify({ deleted: true, synced: false })
    this.sync().catch(console.error)
  }

  async sync(): Promise<void> {
    const unsynced = await db.transactions.where('synced').equals(0).toArray()
    if (!unsynced.length) return

    const toDelete = unsynced.filter(item => item.deleted && item.id)
    const toUpsert = unsynced.filter(item => !item.deleted)

    if (toDelete.length > 0) {
      const deleteIds = toDelete.map(i => i.id as string)
      const { error } = await supabase.from('transactions').delete().in('id', deleteIds)
      if (!error) {
        await db.transactions.bulkDelete(toDelete.map(i => i.localId as string))
      } else console.error('[Sync] Bulk delete failed', error)
    }

    if (toUpsert.length > 0) {
      const payload = toUpsert.map(({ id, title, amount, type, date, category_id, wallet_id, payee_id, user_id, notes, updated_at }) =>
        ({ id, title, amount, type, date, category_id, wallet_id, payee_id, user_id, notes, updated_at }))

      const { data, error } = await supabase.from('transactions').upsert(payload).select('id')
      if (!error && data) {
        const remoteIds = new Set(data.map((d: { id: string }) => d.id))
        const validUpdates = toUpsert.filter(item => item.id && remoteIds.has(item.id))

        if (validUpdates.length > 0) {
          await db.transaction('rw', db.transactions, async () => {
            const keys = validUpdates.map(u => u.localId as string)
            const records = await db.transactions.bulkGet(keys)
            const newRecords = records.reduce((acc, record) => {
              if (record) acc.push({ ...record, synced: true } as LocalTransaction)
              return acc
            }, [] as LocalTransaction[])
            if (newRecords.length > 0) await db.transactions.bulkPut(newRecords)
          })
        }
      } else console.error('[Sync] Bulk upsert failed', error)
    }
  }

  private mapToEntity(item: LocalTransaction): Transaction {
    return { ...(item as unknown as Transaction), synced: !!item.synced, deleted: !!item.deleted }
  }
}

export class DexieWalletRepository implements IWalletRepository {
  async getAll(): Promise<Wallet[]> { return await db.wallets.toArray() as Wallet[] }
  async save(wallet: Wallet): Promise<void> { await db.wallets.put({ ...wallet, synced: false } as LocalWallet) }
  async getById(id: string): Promise<Wallet | null> { const w = await db.wallets.get(id); return w ? w as Wallet : null }
}

export class DexieCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> { return await db.categories.toArray() as Category[] }
  async save(category: Category): Promise<void> { await db.categories.put({ ...category, synced: false } as LocalCategory) }
}
