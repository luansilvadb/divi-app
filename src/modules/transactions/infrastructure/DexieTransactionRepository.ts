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

  async create(transaction: Omit<Transaction, 'created_at' | 'sync_status' | 'version' | 'deleted'> & { id?: string }): Promise<Transaction> {
    try {
      const id = (transaction as any).id || uuidv7()
      const created_at = new Date().toISOString()
      const version = 1
      const deleted = false
      const sync_status = 'pending'

      await db.transaction('rw', db.transactions, db.wallets, async () => {
        const fullTransaction = { ...transaction, id, created_at, version, deleted, sync_status } as Transaction
        await this.updateWalletBalances(fullTransaction)

        const localData = this.mapToLocalRecord(id, fullTransaction)
        await db.transactions.put(localData)
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieTransactionRepository] Transação criada localmente de forma atômica.')
      const result = await db.transactions.get(id)
      return this.mapToEntity(result!) as unknown as Transaction
    } catch (err) {
      throw new InfrastructureError('Failed to create transaction in local DB', err)
    }
  }

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      await db.transaction('rw', db.transactions, db.wallets, async () => {
        const oldData = await db.transactions.get(id)
        if (!oldData) throw new Error('Transaction not found')

        const merged: Transaction = {
          ...this.mapToEntity(oldData),
          ...transaction,
        } as Transaction

        await this.updateWalletBalances(merged, oldData)

        const localData = {
          ...oldData,
          ...transaction,
          amount: transaction.amount !== undefined ? BigInt(transaction.amount) : oldData.amount,
          sync_status: 'pending' as const,
          client_updated_at: new Date().toISOString(),
        }
        await db.transactions.put(localData)
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieTransactionRepository] Transação atualizada localmente de forma atômica.')
      const result = await db.transactions.get(id)
      return this.mapToEntity(result!) as unknown as Transaction
    } catch (err) {
      throw new InfrastructureError('Failed to update transaction in local DB', err)
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

  async transferBetweenWallets(
    fromWalletId: string,
    toWalletId: string,
    amount: bigint,
    description: string = '',
    date: Date = new Date(),
  ): Promise<void> {
    try {
      await db.transaction('rw', db.transactions, db.wallets, async () => {
        const fromWallet = await db.wallets.get(fromWalletId)
        const toWallet = await db.wallets.get(toWalletId)

        if (!fromWallet || !toWallet) throw new Error('Wallets not found')

        const transferId = uuidv7()
        const timestamp = new Date().toISOString()

        const debit: LocalTransaction = {
          id: uuidv7(),
          title: `Transfer to ${toWallet.name}`,
          amount,
          type: 'transfer',
          category_id: '',
          wallet_id: fromWalletId,
          date: date.toISOString(),
          notes: description,
          user_id: fromWallet.user_id,
          sync_status: 'pending',
          client_updated_at: timestamp,
          created_at: timestamp,
          deleted: false,
          version: 1,
          transfer_id: transferId,
        }

        const credit: LocalTransaction = {
          id: uuidv7(),
          title: `Transfer from ${fromWallet.name}`,
          amount,
          type: 'transfer',
          category_id: '',
          wallet_id: toWalletId,
          date: date.toISOString(),
          notes: description,
          user_id: toWallet.user_id,
          sync_status: 'pending',
          client_updated_at: timestamp,
          created_at: timestamp,
          deleted: false,
          version: 1,
          transfer_id: transferId,
        }

        await db.transactions.bulkPut([debit, credit])
        await db.wallets.put({ ...fromWallet, balance: BigInt(fromWallet.balance) - amount })
        await db.wallets.put({ ...toWallet, balance: BigInt(toWallet.balance) + amount })
      })

      SyncEngine.getInstance().enqueueSync()
    } catch (err) {
      throw new InfrastructureError('Failed to execute transfer', err)
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
