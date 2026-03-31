# Core Financial Contracts

## ITransactionRepository
- `getAll(): Promise<Transaction[]>`
- `getByDateRange(start: Date, end: Date): Promise<Transaction[]>`
- `save(transaction: Transaction): Promise<void>`
- `delete(id: string): Promise<void>`

## IWalletRepository
- `getAll(): Promise<Wallet[]>`
- `updateBalance(id: string, amount: number): Promise<void>`
