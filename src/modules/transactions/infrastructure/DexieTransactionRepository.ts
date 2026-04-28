import { v7 as uuidv7 } from 'uuid'
import type { Observable } from 'rxjs'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { db, type LocalTransaction } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'
import { InfrastructureError } from '../domain/errors'
import { liveQuery } from 'dexie'

export class DexieTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    try {
      const list = await db.transactions.filter((t) => !t.deleted).toArray()
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
      const id = transaction.id || uuidv7()

      await db.transaction('rw', db.transactions, db.wallets, async () => {
        const oldData = await db.transactions.get(id)
        await this.updateWalletBalances(transaction, oldData)

        const localData = this.mapToLocalRecord(id, transaction)
        await db.transactions.put(localData)
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieTransactionRepository] Transação salva localmente de forma atômica.')
    } catch (err) {
      throw new InfrastructureError('Failed to save transaction to local DB', err)
    }
  }

  private async updateWalletBalances(transaction: Transaction, oldData?: LocalTransaction): Promise<void> {
    // Calcular o impacto da transação atual (income soma, expense subtrai)
    let walletDelta = BigInt(transaction.amount)
    if (transaction.type === 'expense') walletDelta = -walletDelta

    if (oldData && !oldData.deleted) {
      // Reverter impacto da transação antiga 
      let oldWalletDelta = BigInt(oldData.amount)
      if (oldData.type === 'expense') oldWalletDelta = -oldWalletDelta

      if (oldData.wallet_id === transaction.wallet_id) {
        walletDelta = walletDelta - oldWalletDelta
      } else {
        // Mudança de carteira: reverter na antiga
        const oldWallet = await db.wallets.get(oldData.wallet_id)
        if (oldWallet) {
          await db.wallets.put({ ...oldWallet, balance: BigInt(oldWallet.balance) - oldWalletDelta })
        }
      }
    }

    if (walletDelta !== 0n) {
      const wallet = await db.wallets.get(transaction.wallet_id)
      if (wallet) {
        await db.wallets.put({ ...wallet, balance: BigInt(wallet.balance) + walletDelta })
      }
    }
  }

  private mapToLocalRecord(id: string, transaction: Transaction): LocalTransaction {
    return {
      id,
      title: transaction.title,
      amount: BigInt(transaction.amount),
      type: transaction.type,
      category_id: transaction.category_id,
      wallet_id: transaction.wallet_id,
      payee_id: transaction.payee_id,
      date: transaction.date,
      notes: transaction.notes,
      tags: transaction.tags ? [...transaction.tags] : [],
      user_id: transaction.user_id,
      sync_status: transaction.sync_status || 'pending',
      client_updated_at: transaction.client_updated_at || new Date().toISOString(),
      created_at: transaction.created_at || new Date().toISOString(),
      deleted: !!transaction.deleted,
      version: transaction.version || 1,
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.transaction('rw', db.transactions, db.wallets, async () => {
        const oldData = await db.transactions.get(id)
        if (oldData && !oldData.deleted) {
          let oldWalletDelta = BigInt(oldData.amount)
          if (oldData.type === 'expense') oldWalletDelta = -oldWalletDelta
          
          const oldWallet = await db.wallets.get(oldData.wallet_id)
          if (oldWallet) {
            await db.wallets.put({ ...oldWallet, balance: BigInt(oldWallet.balance) - oldWalletDelta })
          }
        }

        await db.transactions.update(id, {
          deleted: true,
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
        })
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieTransactionRepository] Transação marcada para deleção de forma atômica.')
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
      created_at: item.created_at,
      deleted: !!item.deleted,
      version: item.version || 1,
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
