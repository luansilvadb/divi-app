import type { Transaction } from '@/shared/domain/entities/Transaction';

export interface ITransactionRepository {
  getAll(): Promise<Transaction[]>;
  create(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction>;
  update(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
  delete(id: string): Promise<void>;

  // Método específico para transferência entre carteiras
  transferBetweenWallets(
    fromWalletId: string,
    toWalletId: string,
    amount: bigint,
    description?: string,
    date?: Date
  ): Promise<void>;
}
