import { v7 as uuidv7 } from 'uuid'
import type { Observable } from 'rxjs'
import type { ITransactionRepository } from '../core/ports/ITransactionRepository'
import type { ITransaction } from '../core/entities/ITransaction'
import { db, type LocalITransaction } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'
import { InfrastructureError } from '../domain/errors'
import { liveQuery } from 'dexie'

export class DexieITransactionRepository implements ITransactionRepository {
  async getAll(): Promise<ITransaction[]> {
    try {
      const list = await db.transactions.filter((t) => !t.deleted).toArray()
      return list.map((item) => this.mapToEntity(item))
    } catch (err) {
      throw new InfrastructureError('Failed to get transactions from local DB', err)
    }
  }

  async getByMonth(year: number, month: number): Promise<ITransaction[]> {
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

  watchAll(): Observable<ITransaction[]> {
    return liveQuery(() =>
      db.transactions.filter((t) => !t.deleted).toArray(),
    ) as unknown as Observable<ITransaction[]>
  }

  async create(ITransaction: Omit<ITransaction, 'created_at' | 'sync_status' | 'version' | 'deleted'> & { id?: string }): Promise<ITransaction> {
    try {
      const id = (ITransaction as any).id || uuidv7()
      const created_at = new Date().toISOString()
      const version = 1
      const deleted = false
      const sync_status = 'pending'

      await db.ITransaction('rw', db.transactions, db.wallets, async () => {
        const fullITransaction = { ...ITransaction, id, created_at, version, deleted, sync_status } as ITransaction
        await this.updateIWalletBalances(fullITransaction)

        const localData = this.mapToLocalRecord(id, fullITransaction)
        await db.transactions.put(localData)
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieITransactionRepository] Transação criada localmente de forma atômica.')
      const result = await db.transactions.get(id)
      return this.mapToEntity(result!) as unknown as ITransaction
    } catch (err) {
      throw new InfrastructureError('Failed to create ITransaction in local DB', err)
    }
  }

  async update(id: string, ITransaction: Partial<ITransaction>): Promise<ITransaction> {
    try {
      await db.ITransaction('rw', db.transactions, db.wallets, async () => {
        const oldData = await db.transactions.get(id)
        if (!oldData) throw new Error('ITransaction not found')

        const merged: ITransaction = {
          ...this.mapToEntity(oldData),
          ...ITransaction,
        } as ITransaction

        await this.updateIWalletBalances(merged, oldData)

        const localData = {
          ...oldData,
          ...ITransaction,
          amount: ITransaction.amount !== undefined ? BigInt(ITransaction.amount) : oldData.amount,
          sync_status: 'pending' as const,
          client_updated_at: new Date().toISOString(),
        }
        await db.transactions.put(localData)
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieITransactionRepository] Transação atualizada localmente de forma atômica.')
      const result = await db.transactions.get(id)
      return this.mapToEntity(result!) as unknown as ITransaction
    } catch (err) {
      throw new InfrastructureError('Failed to update ITransaction in local DB', err)
    }
  }

  private async updateIWalletBalances(ITransaction: ITransaction, oldData?: LocalITransaction): Promise<void> {
    // Calcular o impacto da transação atual (income soma, expense subtrai)
    let IWalletDelta = BigInt(ITransaction.amount)
    if (ITransaction.type === 'expense') IWalletDelta = -IWalletDelta

    if (oldData && !oldData.deleted) {
      // Reverter impacto da transação antiga 
      let oldIWalletDelta = BigInt(oldData.amount)
      if (oldData.type === 'expense') oldIWalletDelta = -oldIWalletDelta

      if (oldData.wallet_id === ITransaction.wallet_id) {
        IWalletDelta = IWalletDelta - oldIWalletDelta
      } else {
        // Mudança de carteira: reverter na antiga
        const oldIWallet = await db.wallets.get(oldData.wallet_id)
        if (oldIWallet) {
          await db.wallets.put({ ...oldIWallet, balance: BigInt(oldIWallet.balance) - oldIWalletDelta })
        }
      }
    }

    if (IWalletDelta !== 0n) {
      const IWallet = await db.wallets.get(ITransaction.wallet_id)
      if (IWallet) {
        await db.wallets.put({ ...IWallet, balance: BigInt(IWallet.balance) + IWalletDelta })
      }
    }
  }

  private mapToLocalRecord(id: string, ITransaction: ITransaction): LocalITransaction {
    return {
      id,
      title: ITransaction.title,
      amount: BigInt(ITransaction.amount),
      type: ITransaction.type,
      category_id: ITransaction.category_id,
      wallet_id: ITransaction.wallet_id,
      payee_id: ITransaction.payee_id,
      date: ITransaction.date,
      notes: ITransaction.notes,
      tags: ITransaction.tags ? [...ITransaction.tags] : [],
      user_id: ITransaction.user_id,
      sync_status: ITransaction.sync_status || 'pending',
      client_updated_at: ITransaction.client_updated_at || new Date().toISOString(),
      created_at: ITransaction.created_at || new Date().toISOString(),
      deleted: !!ITransaction.deleted,
      version: ITransaction.version || 1,
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.ITransaction('rw', db.transactions, db.wallets, async () => {
        const oldData = await db.transactions.get(id)
        if (oldData && !oldData.deleted) {
          let oldIWalletDelta = BigInt(oldData.amount)
          if (oldData.type === 'expense') oldIWalletDelta = -oldIWalletDelta
          
          const oldIWallet = await db.wallets.get(oldData.wallet_id)
          if (oldIWallet) {
            await db.wallets.put({ ...oldIWallet, balance: BigInt(oldIWallet.balance) - oldIWalletDelta })
          }
        }

        await db.transactions.update(id, {
          deleted: true,
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
        })
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieITransactionRepository] Transação marcada para deleção de forma atômica.')
    } catch (err) {
      throw new InfrastructureError('Failed to delete ITransaction', err)
    }
  }

  async transferBetweenwallets(
    fromIWalletId: string,
    toIWalletId: string,
    amount: bigint,
    description: string = '',
    date: Date = new Date(),
  ): Promise<void> {
    try {
      await db.ITransaction('rw', db.transactions, db.wallets, async () => {
        const fromIWallet = await db.wallets.get(fromIWalletId)
        const toIWallet = await db.wallets.get(toIWalletId)

        if (!fromIWallet || !toIWallet) throw new Error('wallets not found')

        const transferId = uuidv7()
        const timestamp = new Date().toISOString()

        const debit: LocalITransaction = {
          id: uuidv7(),
          title: `Transfer to ${toIWallet.name}`,
          amount,
          type: 'transfer',
          category_id: '',
          wallet_id: fromIWalletId,
          date: date.toISOString(),
          notes: description,
          user_id: fromIWallet.user_id,
          sync_status: 'pending',
          client_updated_at: timestamp,
          created_at: timestamp,
          deleted: false,
          version: 1,
          transfer_id: transferId,
        }

        const credit: LocalITransaction = {
          id: uuidv7(),
          title: `Transfer from ${fromIWallet.name}`,
          amount,
          type: 'transfer',
          category_id: '',
          wallet_id: toIWalletId,
          date: date.toISOString(),
          notes: description,
          user_id: toIWallet.user_id,
          sync_status: 'pending',
          client_updated_at: timestamp,
          created_at: timestamp,
          deleted: false,
          version: 1,
          transfer_id: transferId,
        }

        await db.transactions.bulkPut([debit, credit])
        await db.wallets.put({ ...fromIWallet, balance: BigInt(fromIWallet.balance) - amount })
        await db.wallets.put({ ...toIWallet, balance: BigInt(toIWallet.balance) + amount })
      })

      SyncEngine.getInstance().enqueueSync()
    } catch (err) {
      throw new InfrastructureError('Failed to execute transfer', err)
    }
  }

  private mapToEntity(
    item: LocalITransaction,
  ): ITransaction & { _titleLower: string; _timestamp: number; _dateKey: string } {
    const t = {
      ...(item as unknown as ITransaction),
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
