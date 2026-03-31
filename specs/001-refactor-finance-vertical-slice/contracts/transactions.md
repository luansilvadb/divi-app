# Transaction Module Contracts

## Domain Repositories

### ITransactionRepository
- `getAll(): Promise<Transaction[]>`
- `getByDateRange(start: Date, end: Date): Promise<Transaction[]>`
- `save(transaction: Transaction): Promise<void>`
- `delete(id: string): Promise<void>`

## Application Services

### IAutoCategorizationService
- `suggestCategory(title: string): Promise<Category | null>`
