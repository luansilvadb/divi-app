import { v7 as uuidv7 } from 'uuid'
import type { Observable } from 'rxjs'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { db, type LocalTransaction } from '@/core/db'
import { SyncEngine } from '@/core/sync/SyncEngine'
import { InfrastructureError } from '../domain/errors'
import { liveQuery } from 'dexie'
export class DexieTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    try {
      const list = await db.transactions
        .filter(t => !t.deleted)
        .toArray()
      return list.map((item) => this.mapToEntity(item))
    } catch (err) {
      throw new InfrastructureError('Failed to get transactions from local DB', err)
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

  watchAll(): Observable<Transaction[]> {
    return liveQuery(() =>
      db.transactions.filter((t) => !t.deleted).toArray(),
    ) as unknown as Observable<Transaction[]>
  }

  async save(transaction: Transaction): Promise<void> {
    try {
      // GARANTE IDENTIDADE: Toda transação nasce com UUID no cliente
      const id = transaction.id || uuidv7()
      
      const localData: LocalTransaction = {
        ...transaction,
        id, // UUID Estável
        sync_status: transaction.sync_status || 'pending',
        client_updated_at: transaction.client_updated_at || new Date().toISOString(),
        deleted: !!transaction.deleted,
        version: transaction.version || 1
      }

      await db.transactions.put(localData)
      
      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieTransactionRepository] Transação salva localmente. Sync disparado.')
    } catch (err) {
      throw new InfrastructureError('Failed to save transaction to local DB', err)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Soft delete locally with State-Based flags
      await db.transactions.update(id, { 
        deleted: true 
      })
      
      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieTransactionRepository] Transação marcada para deleção. Sync disparado.')
    } catch (err) {
      throw new InfrastructureError('Failed to delete transaction', err)
    }
  }

  private mapToEntity(
    item: LocalTransaction,
  ): Transaction & { _titleLower: string; _timestamp: number; _dateKey: string } {
    const t = {
      ...(item as unknown as Transaction),
      sync_status: item.sync_status,
      client_updated_at: item.client_updated_at,
      deleted: !!item.deleted,
      version: item.version || 1
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

