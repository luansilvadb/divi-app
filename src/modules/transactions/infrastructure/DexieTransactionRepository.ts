import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { db, type LocalTransaction } from '@/core/db'
import { InfrastructureError } from '../domain/errors'
import { liveQuery } from 'dexie'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexieTransactionRepository implements ITransactionRepository {
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

  watchAll(): any {
    return liveQuery(() => db.transactions.toArray())
  }

  async save(transaction: Transaction): Promise<void> {
    try {
      const now = new Date().toISOString()
      
      // GARANTE IDENTIDADE: Toda transação nasce com UUID no cliente
      const id = transaction.id || crypto.randomUUID()
      
      const localData: LocalTransaction = {
        ...transaction,
        id, // UUID Estável
        syncStatus: 'pending',
        is_dirty: 1,
        last_modified_at: now,
        updated_at: now,
      }

      if (transaction.localId) {
        await db.transactions.put(localData)
      } else {
        await db.transactions.add(localData)
      }
      
      // Empuxo imediato
      SyncEngine.getInstance().trigger()
      
      console.debug('[DexieTransactionRepository] Transação marcada como "dirty" e salva localmente.')
    } catch (err) {
      throw new InfrastructureError('Failed to save transaction to local DB', err)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const now = new Date().toISOString()
      // Soft delete locally with State-Based flags
      await db.transactions.where('id').equals(id).modify({ 
        deleted: true, 
        is_dirty: 1, 
        last_modified_at: now,
        syncStatus: 'pending' 
      })

      // Empuxo imediato
      SyncEngine.getInstance().trigger()
      
      console.debug('[DexieTransactionRepository] Transação marcada para deleção (dirty).')
    } catch (err) {
      throw new InfrastructureError('Failed to delete transaction', err)
    }
  }

  private mapToEntity(
    item: LocalTransaction,
  ): Transaction & { _titleLower: string; _timestamp: number; _dateKey: string } {
    const t = {
      ...(item as unknown as Transaction),
      syncStatus: item.syncStatus,
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
