import { BehaviorSubject } from 'rxjs'
import type { ITransactionRepository } from '../../core/ports/ITransactionRepository'
import type { ITransaction } from '../../core/entities/ITransaction'
import type { IAuthService } from '../../../auth/core/ports/IAuthService'
import type { ITransactionService } from '../../core/ports/ITransactionService'
import { BigIntAdapter } from '@/shared/utils/bigint-adapter'
import { AuthError } from '@/core/errors'
import { transactionValidator } from './TransactionValidator'
import { messages } from '@/shared/messages/catalog'

const REQUIRED_FIELDS = ['title', 'amount', 'type', 'category_id', 'wallet_id', 'date'] as const

/**
 * TransactionService with extensible validation (OCP).
 * Custom validators can be registered via transactionValidator without modifying this class.
 */
export class TransactionService implements ITransactionService {
  // Extensible validator - allows adding custom rules without modifying core logic
  private _validator = transactionValidator
  private _transactionsSubject = new BehaviorSubject<ITransaction[]>([])
  public readonly transactions$ = this._transactionsSubject.asObservable()

  constructor(
    private readonly ITransactionRepository: ITransactionRepository,
    private readonly authService: IAuthService
  ) {}


  async loadMonthlytransactions(year: number, month: number): Promise<void> {
    const list = await this.ITransactionRepository.getByMonth(year, month)
    this._transactionsSubject.next(list)
  }

  async saveITransaction(params: {
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
    const user = await this.authService.getCurrentUser()
    const userId = user?.id
    if (!userId) throw new AuthError(messages.MSG_E_UNAUTHORIZED)

    // Extensible validation via transactionValidator (OCP)
    // Required fields validation
    for (const field of REQUIRED_FIELDS) {
      this._validator.validate('required', { field, value: params[field as keyof typeof params], params })
    }

    // ITransaction type validation (extensible)
    this._validator.validate('ITransactionType', { field: 'type', value: params.type, params })

    // Positive amount validation (extensible)
    this._validator.validate('positiveAmount', { field: 'amount', value: params.amount, params })

    const amount = BigIntAdapter.toMinorUnits(params.amount)
    const isUpdate = !!params.id

    if (isUpdate) {
      await this.ITransactionRepository.update(params.id!, {
        title: params.title,
        amount,
        type: params.type,
        category_id: params.category_id,
        wallet_id: params.wallet_id,
        date: params.date,
        notes: params.notes,
        tags: params.tags,
        payee_id: params.payee_id,
      })
    } else {
      const ITransaction: Omit<ITransaction, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'> = {
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
      }
      await this.ITransactionRepository.create(ITransaction)
    }

    // Recarregar o mês atual da transação para garantir que a UI reflita a mudança
    const date = new Date(params.date)
    await this.loadMonthlytransactions(date.getFullYear(), date.getMonth() + 1)
  }

  async deleteITransaction(id: string, year: number, month: number): Promise<void> {
    await this.ITransactionRepository.delete(id)
    await this.loadMonthlytransactions(year, month)
  }
}
