# Contract: ITransactionRepository

## Methods

### `getAll(): Promise<Transaction[]>`
Retrieves all transactions from the local store.

### `create(transaction: Omit<Transaction, 'id' | 'created_at' | 'sync_status' | 'version' | 'deleted'>): Promise<Transaction>`
Creates a new transaction. The adapter is responsible for generating the ID and initializing metadata.

### `update(id: string, transaction: Partial<Transaction>): Promise<Transaction>`
Updates an existing transaction by ID.

### `delete(id: string): Promise<void>`
Marks a transaction as deleted (soft delete).

### `transferBetweenWallets(...)`
Specific method for ledger operations.
- `fromWalletId`: string
- `toWalletId`: string
- `amount`: bigint
- `description`: string
- `date`: Date
