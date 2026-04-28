# Data Model: Core Entities (Restored)

## Base: SyncMetadata
All entities participating in the sync engine must implement this interface.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| user_id | string | Owner of the record |
| sync_status | 'synced' \| 'pending' \| 'failed' | State in the sync queue |
| client_updated_at | string (ISO) | Last local update time |
| created_at | string (ISO) | Record creation time |
| version | number | Lamport clock / version counter |
| deleted | boolean | Soft delete flag |

## Entity: Transaction
Inherits from `SyncMetadata`.

| Field | Type | Description |
|-------|------|-------------|
| title | string | Description of the transaction |
| amount | bigint | Value in cents/smallest unit |
| type | 'income' \| 'expense' \| 'transfer' | Transaction type |
| category_id | string | Reference to Category |
| wallet_id | string | Reference to Wallet |
| date | string (ISO) | Transaction date |

## Entity: Budget
Inherits from `SyncMetadata`.

| Field | Type | Description |
|-------|------|-------------|
| category_id | string | Targeted category |
| limit_value | bigint | Maximum spend amount |
| period | 'monthly' \| 'weekly' | Recurrence |

## Entity: Wallet
Inherits from `SyncMetadata`.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Wallet name |
| balance | bigint | Current available balance |
| currency | string | Currency code (e.g., 'BRL') |
| type | string | 'bank' \| 'cash' \| 'credit' |
