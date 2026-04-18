## ADDED Requirements

### Requirement: Transaction entity SHALL extend SyncMetadata
The `Transaction` interface SHALL extend `SyncMetadata` and use snake_case string fields matching the actual contract consumed by repositories and stores.

Fields SHALL include: `title: string`, `type: 'income' | 'expense'`, `category_id: string`, `wallet_id: string`, `payee_id?: string`, `tags?: string[]`, `notes?: string`, `date: string`, `amount: bigint`.

The legacy fields (`walletId`, `description`, `createdAt: Date`, `updatedAt: Date`, `TransactionType` with `'INCOME'|'EXPENSE'|'TRANSFER'`, `TransferTransaction`) SHALL be removed.

#### Scenario: Transaction interface matches store usage
- **WHEN** a Transaction object is created with fields `id`, `user_id`, `title`, `amount`, `type`, `category_id`, `wallet_id`, `date`, `sync_status`, `deleted`, `client_updated_at`, `version`
- **THEN** the TypeScript compiler accepts the object without type errors

#### Scenario: Transaction extends SyncMetadata
- **WHEN** a Transaction object is inspected
- **THEN** it includes all SyncMetadata fields (`id`, `user_id`, `sync_status`, `client_updated_at`, `created_at`, `version`, `deleted`, `last_synced_at?`, `server_updated_at?`)

### Requirement: Wallet entity SHALL extend SyncMetadata
The `Wallet` interface SHALL extend `SyncMetadata` and use snake_case string fields matching the actual contract consumed by repositories and stores.

Fields SHALL include: `name: string`, `balance: bigint`, `currency: string`, `type: string`, `icon?: string`, `color?: string`.

The legacy fields (`createdAt: Date`, `updatedAt: Date`, `WalletType` enum) SHALL be removed.

#### Scenario: Wallet interface matches store usage
- **WHEN** a Wallet object is created with fields `id`, `user_id`, `name`, `balance`, `currency`, `type`, `sync_status`, `deleted`, `client_updated_at`, `version`
- **THEN** the TypeScript compiler accepts the object without type errors

#### Scenario: Wallet extends SyncMetadata
- **WHEN** a Wallet object is inspected
- **THEN** it includes all SyncMetadata fields

### Requirement: No existing code SHALL break after entity alignment
All existing imports of `Transaction` and `Wallet` types SHALL compile successfully after the change. If any consumer uses legacy fields, it SHALL be migrated to use the new fields.

#### Scenario: All Transaction imports compile
- **WHEN** the project is built after entity alignment
- **THEN** no TypeScript compilation errors related to Transaction fields occur

#### Scenario: All Wallet imports compile
- **WHEN** the project is built after entity alignment
- **THEN** no TypeScript compilation errors related to Wallet fields occur
