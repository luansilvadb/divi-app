import type { 
  ITransactionRepository, 
  IWalletRepository, 
  ICategoryRepository 
} from '../../domain/repositories'
import type { Transaction, Wallet, Category } from '../../domain/entities'
import { db } from '../../../../core/db'
import { supabase } from '../../../../core/supabase'

export class DexieSupabaseTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    const list = await db.transactions.toArray()
    // Map local DB format to Domain Entity
    return list.map(this.mapToEntity)
  }

  async getByMonth(year: number, month: number): Promise<Transaction[]> {
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 0, 23, 59, 59).toISOString()
    
    const list = await db.transactions
      .where('date')
      .between(start, end)
      .and(t => !t.deleted)
      .toArray()
      
    return list.map(this.mapToEntity)
  }

  async save(transaction: Transaction): Promise<void> {
    const now = new Date().toISOString()
    const localData = {
      ...transaction,
      synced: false,
      updated_at: now
    }
    
    if (transaction.localId) {
      await db.transactions.put(localData as any)
    } else {
      await db.transactions.add(localData as any)
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
    
    for (const item of unsynced) {
      if (item.deleted && item.id) {
        const { error } = await supabase.from('transactions').delete().eq('id', item.id)
        if (!error) {
          await db.transactions.delete(item.localId!)
        }
      } else {
        const { data, error } = await supabase
          .from('transactions')
          .upsert({
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
            updated_at: item.updated_at
          })
          .select()
          .single()

        if (!error && data) {
          await db.transactions.update(item.localId!, { 
            id: data.id, 
            synced: true 
          })
        }
      }
    }
  }

  private mapToEntity(item: any): Transaction {
    return {
      ...item,
      synced: !!item.synced,
      deleted: !!item.deleted
    }
  }
}

export class DexieWalletRepository implements IWalletRepository {
  async getAll(): Promise<Wallet[]> {
    const list = await db.wallets.toArray()
    return list as Wallet[]
  }

  async save(wallet: Wallet): Promise<void> {
    await db.wallets.put(wallet as any)
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
    await db.categories.put(category as any)
  }
}
