import { BehaviorSubject } from 'rxjs';
import type { Transaction } from '@/shared/domain/entities/Transaction';
import type { ITransactionRepository } from '@/modules/ledger/domain/contracts/ITransactionRepository';

export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(
    private transactionRepository: ITransactionRepository,
  ) {}

  // Método para executar transferência entre carteiras
  async executeTransfer(
    fromWalletId: string,
    toWalletId: string,
    amount: bigint,
    description: string = '',
    date: Date = new Date()
  ): Promise<void> {
    // Validação básica
    if (!fromWalletId || !toWalletId) {
      throw new Error('IDs de carteira inválidos');
    }

    if (amount <= 0n) {
      throw new Error('Valor deve ser positivo');
    }

    if (fromWalletId === toWalletId) {
      throw new Error('Carteira de origem e destino não podem ser iguais');
    }

    // Executa a transferência no repositório
    await this.transactionRepository.transferBetweenWallets(
      fromWalletId,
      toWalletId,
      amount,
      description,
      date
    );

    // Atualiza o estado local (simulado)
    const updatedTransactions = await this.transactionRepository.getAll();
    this.transactionsSubject.next(updatedTransactions);
  }

  // Métodos existentes para compatibilidade
  async getAll(): Promise<Transaction[]> {
    return this.transactionRepository.getAll();
  }

  async create(transaction: Omit<Transaction, 'id' | 'created_at' | 'client_updated_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Transaction> {
    return this.transactionRepository.create(transaction);
  }

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    return this.transactionRepository.update(id, transaction);
  }

  async delete(id: string): Promise<void> {
    return this.transactionRepository.delete(id);
  }
}
