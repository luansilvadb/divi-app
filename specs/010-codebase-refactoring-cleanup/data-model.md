# Data Model: Refactoring & Densification

This feature does not introduce new persistent entities but refactors the structural "entities" of the application layer.

## Refactored Modules

### 1. ITransactionForm (Composable)
- **Purpose**: Manages the state, validation, and lifecycle of the transaction entry form.
- **Attributes**:
  - `formState`: Reactive state for ITransaction fields.
  - `isSubmitting`: Boolean loading state.
  - `masking`: Logic for currency formatting.
- **Methods**:
  - `submit()`: Validates and saves the transaction.
  - `delete()`: Removes the transaction.

### 2. TransactionStore (Pinia Store)
- **Purpose**: SSOT for transactions in the current month.
- **Refactoring**: Remove delegation to `walletStore` and `categoryStore`. The store should only provide transaction-specific actions.
- **Relationships**:
  - Uses `ITransactionRepository` (Port) for persistence.
  - Uses `IActivityLogService` (Port) for logging.

### 3. BigIntAdapter (Utility)
- **Purpose**: Shared primitives for bigint/currency conversion.
- **Cleanup**: Remove redundant comments and finalize "TODO"-style internal notes.

## Responsibility Map (Post-Refactoring)

| Module | Layer | Responsibility |
|--------|-------|----------------|
| `useTransactionForm` | UI/Composable | Form state, input masking, UI feedback. |
| `transactionStore` | Application | Global transaction state, month-based fetching. |
| `AutoCreateService` | Core/Service | Resolving/creating missing wallets/categories. |
| `TransactionValidator` | Application | Structural validation of transaction inputs. |
