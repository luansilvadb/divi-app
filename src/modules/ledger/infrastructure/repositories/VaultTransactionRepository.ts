import { v7 as uuidv7 } from 'uuid'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { db, type LocalTransaction, type LocalWallet } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'
import { InfrastructureError } from '@/shared/domain/errors/InfrastructureError'
import { liveQuery } from 'dexie'
import type { Observable } from 'rxjs'

export class VaultTransactionRepository implements ITransactionRepository {
  async getAll(): Promise<Transaction[]> {
    try {
      const transactions = await db.transactions.filter((t) => !t.deleted).toArray()
      return transactions.map((item) => this.mapToEntity(item))
    } catch (err) {
      throw new InfrastructureError('Failed to get transactions from local DB', err)
    }
  }

  async getByMonth(year: number, month: number): Promise<Transaction[]> {
    try {
      const start = new Date(year, month - 1, 1).toISOString()
      const end = new Date(year, month, 0, 23, 59, 59).toISOString()

      const transactions = await db.transactions
        .where('date')
        .between(start, end)
        .and((t) => !t.deleted)
        .toArray()

      return transactions.map((item) => this.mapToEntity(item))
    } catch (err) {
      throw new InfrastructureError('Failed to get transactions by month from local DB', err)
    }
  }

  private calculateWalletDelta(transaction: Transaction, oldData: LocalTransaction | undefined): bigint {
    let walletDelta = BigInt(transaction.amount)
    if (transaction.type === 'expense') walletDelta = -walletDelta

    if (oldData && !oldData.deleted) {
      let oldWalletDelta = BigInt(oldData.amount)
      if (oldData.type === 'expense') oldWalletDelta = -oldWalletDelta

      if (oldData.wallet_id === transaction.wallet_id) {
        walletDelta = walletDelta - oldWalletDelta
      } else {
        walletDelta = walletDelta + oldWalletDelta
      }
    }

    return walletDelta
  }

  private async applyWalletChanges(
    transaction: Transaction,
    oldData: LocalTransaction | undefined,
    walletDelta: bigint,
  ): Promise<void> {
    if (oldData && !oldData.deleted && oldData.wallet_id !== transaction.wallet_id) {
      const oldWallet = await db.wallets.get(oldData.wallet_id)
      if (oldWallet) {
        let oldWalletDelta = BigInt(oldData.amount)
        if (oldData.type === 'expense') oldWalletDelta = -oldWalletDelta
        await db.wallets.put({
          ...oldWallet,
          balance: BigInt(oldWallet.balance) - oldWalletDelta,
        })
      }
    }

    if (walletDelta !== 0n) {
      const wallet = await db.wallets.get(transaction.wallet_id)
      if (wallet) {
        await db.wallets.put({ ...wallet, balance: BigInt(wallet.balance) + walletDelta })
      }
    }
  }

  async save(transaction: Transaction): Promise<void> {
    try {
      await db.transaction('rw', db.transactions, db.wallets, async () => {
        const id = transaction.id || uuidv7()
        const oldData = await db.transactions.get(id)

        const walletDelta = this.calculateWalletDelta(transaction, oldData)
        await this.applyWalletChanges(transaction, oldData, walletDelta)

        const localData: LocalTransaction = {
          id,
          title: transaction.title,
          amount: BigInt(transaction.amount),
          type: transaction.type,
          category_id: transaction.category_id || '',
          wallet_id: transaction.wallet_id,
          payee_id: transaction.payee_id || undefined,
          date: transaction.date,
          notes: transaction.notes || undefined,
          tags: transaction.tags ? [...transaction.tags] : [],
          user_id: transaction.user_id || '',
          sync_status: transaction.sync_status || 'pending',
          client_updated_at: transaction.client_updated_at || new Date().toISOString(),
          created_at: transaction.created_at,
          deleted: !!transaction.deleted,
          version: transaction.version || 1,
          transfer_id: transaction.transfer_id,
        }

        await db.transactions.put(localData)
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[VaultTransactionRepository] Transação salva localmente de forma atômica.')
    } catch (err) {
      throw new InfrastructureError('Failed to save transaction to local DB', err)
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
            await db.wallets.put({
              ...oldWallet,
              balance: BigInt(oldWallet.balance) - oldWalletDelta,
            })
          }
        }

        await db.transactions.update(id, {
          deleted: true,
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
        })
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug('[VaultTransactionRepository] Transação marcada para deleção de forma atômica.')
    } catch (err) {
      throw new InfrastructureError('Failed to delete transaction', err)
    }
  }

  watchAll(): Observable<Transaction[]> {
    return liveQuery(() =>
      db.transactions.filter((t) => !t.deleted).toArray(),
    ) as unknown as Observable<Transaction[]>
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
        // Validar carteiras existentes
        const fromWallet = await db.wallets.get(fromWalletId)
        const toWallet = await db.wallets.get(toWalletId)

        if (!fromWallet) {
          throw new Error(`Carteira de origem não encontrada: ${fromWalletId}`)
        }
        if (!toWallet) {
          throw new Error(`Carteira de destino não encontrada: ${toWalletId}`)
        }

        // Validar saldo suficiente
        if (BigInt(fromWallet.balance) < amount) {
          throw new Error('Saldo insuficiente para transferência')
        }

        // Gerar transfer_id único para vincular os dois registros
        const transferId = uuidv7()

        // Criar registro de débito (origem)
        const debitRecord: LocalTransaction = {
          id: uuidv7(),
          title: `Transferência para ${toWallet.name}`,
          amount,
          type: 'transfer',
          category_id: '',
          wallet_id: fromWalletId,
          payee_id: undefined,
          date: date.toISOString(),
          notes: description,
          tags: [],
          user_id: fromWallet.user_id || '',
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          deleted: false,
          version: 1,
          transfer_id: transferId,
        }

        // Criar registro de crédito (destino)
        const creditRecord: LocalTransaction = {
          id: uuidv7(),
          title: `Transferência de ${fromWallet.name}`,
          amount,
          type: 'transfer',
          category_id: '',
          wallet_id: toWalletId,
          payee_id: undefined,
          date: date.toISOString(),
          notes: description,
          tags: [],
          user_id: toWallet.user_id || '',
          sync_status: 'pending',
          client_updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          deleted: false,
          version: 1,
          transfer_id: transferId,
        }

        // Salvar ambos os registros
        await db.transactions.put(debitRecord)
        await db.transactions.put(creditRecord)

        // Atualizar saldos das carteiras
        await db.wallets.put({
          ...fromWallet,
          balance: BigInt(fromWallet.balance) - amount,
        })
        await db.wallets.put({
          ...toWallet,
          balance: BigInt(toWallet.balance) + amount,
        })
      })

      SyncEngine.getInstance().enqueueSync()
      console.debug(
        '[VaultTransactionRepository] Transferência entre carteiras executada com sucesso.',
      )
    } catch (err) {
      throw new InfrastructureError('Failed to execute transfer between wallets', err)
    }
  }

  private mapToEntity(
    item: LocalTransaction,
  ): Transaction & { _titleLower: string; _timestamp: number; _dateKey: string } {
    // Pre-calculate derivations to optimize UI rendering
    return {
      ...(item as unknown as Transaction),
      _titleLower: item.title.toLowerCase(),
      _timestamp: new Date(item.date).getTime(),
      _dateKey: item.date.substring(0, 10),
    }
  }
}
