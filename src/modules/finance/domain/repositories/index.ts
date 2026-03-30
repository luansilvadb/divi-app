import type {
  Transaction,
  Wallet,
  Category,
  Payee,
  Budget,
  Goal,
  Loan,
  Subscription,
} from '../entities'

export interface ISubscriptionRepository {
  getAll(): Promise<Subscription[]>
  save(subscription: Subscription): Promise<void>
  delete(id: string): Promise<void>
}

export interface ILoanRepository {
  getAll(): Promise<Loan[]>
  save(loan: Loan): Promise<void>
  delete(id: string): Promise<void>
}

export interface IGoalRepository {
  getAll(): Promise<Goal[]>
  save(goal: Goal): Promise<void>
  delete(id: string): Promise<void>
}

export interface IBudgetRepository {
  getAllActive(): Promise<Budget[]>
  save(budget: Budget): Promise<void>
  delete(id: string): Promise<void>
}

export interface ITransactionRepository {
  getAll(): Promise<Transaction[]>
  getByMonth(year: number, month: number): Promise<Transaction[]>
  save(transaction: Transaction): Promise<void>
  delete(id: string): Promise<void>
  sync(): Promise<void>
}

export interface IWalletRepository {
  getAll(): Promise<Wallet[]>
  save(wallet: Wallet): Promise<void>
  getById(id: string): Promise<Wallet | null>
}

export interface ICategoryRepository {
  getAll(): Promise<Category[]>
  save(category: Category): Promise<void>
}

export interface IPayeeRepository {
  getAll(): Promise<Payee[]>
  save(payee: Payee): Promise<void>
  getByName(name: string): Promise<Payee | null>
}
