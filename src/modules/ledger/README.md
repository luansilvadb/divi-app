# Ledger Module: Transferências Entre Carteiras

This module handles tactical transfers between wallets with atomic operations and proper P&L classification.

## Features

- Atomic transfer operations using Dexie.js transactions
- Automatic debit/credit record creation with unique transfer_id linking
- Real-time wallet balance updates
- Proper classification as 'TRANSFER' for P&L reporting
- Comprehensive error handling and validation

## Architecture

- **Infrastructure**: `VaultTransactionRepository` implements the atomic transfer logic
- **Application**: `LedgerTransactionService` provides the business logic interface
- **UI**: `TransferForm.vue` component for user interaction

## Usage

The transfer functionality is available through the `LedgerTransactionService.executeTransfer()` method:

```ts
await transactionService.executeTransfer(
  'wallet1-id',
  'wallet2-id',
  1000n, // amount in minor units (cents)
  'Transferência tática',
  new Date(),
)
```

## Testing

- Unit tests for `VaultTransactionRepository.transferBetweenWallets`
- Unit tests for `LedgerTransactionService.executeTransfer`

## Security & Validation

- Wallet existence validation
- Sufficient balance validation
- Input sanitization and validation
- Atomic database operations to prevent partial failures
