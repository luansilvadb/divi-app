import { BehaviorSubject } from 'rxjs'
import type { ITransactionRepository } from '@/shared/domain/contracts/ITransactionRepository'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { useAuthStore } from '@/modules/auth/application/authStore'
import { v7 as uuidv7 } from 'uuid'
import { BigIntAdapter } from '@/shared/utils/bigint-adapter'
import { AuthError } from '@/core/errors'
import { TransactionValidator, transactionValidator } from './TransactionValidator'

const REQUIRED_FIELDS = ['title', 'amount', 'type', 'category_id', 'wallet_id', 'date'] as const

/**
 * TransactionService with extensible validation (OCP).
 * Custom validators can be registered via TransactionValidator without modifying this class.
 */
export class TransactionService {
  // Extensible validator - allows adding custom rules without modifying core logic
  private _validator: TransactionValidator = transactionValidator
  private _transactionsSubject = new BehaviorSubject<Transaction[]>([])
  public readonly transactions$ = this._transactionsSubject.asObservable()

  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async loadMonthlyTransactions(year: number, month: number): Promise<void> {
    const list = await this.transactionRepository.getByMonth(year, month)
    this._transactionsSubject.next(list)
  }

  async saveTransaction(params: {
    id?: string
    title: string
    amount: number | string
    type: 'income' | 'expense'
    category_id: string
    wallet_id: string
    date: string
    notes?: string
    tags?: string[]
    payee_id?: string
  }): Promise<void> {
    // Guard clause: Authentication check
    const authStore = useAuthStore()
    const userId = authStore.user?.id
    if (!userId) throw new AuthError('User not authenticated')

    // Extensible validation via TransactionValidator (OCP)
    // Required fields validation
    for (const field of REQUIRED_FIELDS) {
      this._validator.validate('required', { field, value: params[field as keyof typeof params], params })
    }

    // Transaction type validation (extensible)
    this._validator.validate('transactionType', { field: 'type', value: params.type, params })

    // Positive amount validation (extensible)
    this._validator.validate('positiveAmount', { field: 'amount', value: params.amount, params })

    const amount = BigIntAdapter.toMinorUnits(params.amount)

    const transaction: Transaction = {
      id: params.id || uuidv7(),
      user_id: userId,
      title: params.title,
      amount,
      type: params.type,
      category_id: params.category_id,
      wallet_id: params.wallet_id,
      date: params.date,
      notes: params.notes,
      tags: params.tags || [],
      payee_id: params.payee_id,
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }

    await this.transactionRepository.save(transaction)

    // Recarregar o mês atual da transação para garantir que a UI reflita a mudança
    const date = new Date(params.date)
    await this.loadMonthlyTransactions(date.getFullYear(), date.getMonth() + 1)
  }

  async deleteTransaction(id: string, year: number, month: number): Promise<void> {
    await this.transactionRepository.delete(id)
    await this.loadMonthlyTransactions(year, month)
  }
}
