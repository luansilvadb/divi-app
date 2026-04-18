## ADDED Requirements

### Requirement: transactionStore SHALL NOT contain wallet or category persistence logic
The `transactionStore` SHALL delegate wallet and category persistence to their respective services (`WalletService`, `CategoryService`) available via DI. The methods `saveCategory`, `saveWallet` SHALL be removed from the store. The methods `fetchWallets` and `fetchCategories` SHALL remain as thin wrappers that call the services and update local state.

#### Scenario: saveCategory is removed from transactionStore
- **WHEN** the transactionStore API is inspected
- **THEN** `saveCategory` is not exposed

#### Scenario: saveWallet is removed from transactionStore
- **WHEN** the transactionStore API is inspected
- **THEN** `saveWallet` is not exposed

#### Scenario: Category persistence uses CategoryService
- **WHEN** a category needs to be saved from the UI
- **THEN** the component calls `CategoryService.save()` directly or via a dedicated store

#### Scenario: Wallet persistence uses WalletService
- **WHEN** a wallet needs to be saved from the UI
- **THEN** the component calls `WalletService.save()` directly or via a dedicated store

### Requirement: budgetStore.saveBudget SHALL use immutable patterns
The `saveBudget` function SHALL create a new object with the `user_id` set instead of mutating the input parameter.

#### Scenario: saveBudget does not mutate input
- **WHEN** `saveBudget(budget)` is called with a budget that has no `user_id`
- **THEN** the original `budget` object is not modified and a new object with `user_id` set is persisted

#### Scenario: saveBudget preserves existing user_id
- **WHEN** `saveBudget(budget)` is called with a budget that already has a `user_id`
- **THEN** the persisted budget retains the original `user_id`

### Requirement: transactionStore size SHALL be reduced
After decomposition, the `transactionStore` file SHALL be under 300 lines, containing only transaction-specific state, computed properties, and actions.

#### Scenario: transactionStore file length
- **WHEN** the transactionStore file is measured
- **THEN** it contains fewer than 300 lines of code

### Requirement: No functional behavior SHALL change after decomposition
All existing UI flows that save categories, wallets, or transactions SHALL work identically after the refactoring. The only change is internal delegation, not external behavior.

#### Scenario: Category save flow works identically
- **WHEN** a user saves a category through the UI
- **THEN** the category is persisted and appears in the category list, same as before

#### Scenario: Wallet save flow works identically
- **WHEN** a user saves a wallet through the UI
- **THEN** the wallet is persisted and appears in the wallet list, same as before

#### Scenario: Transaction save flow works identically
- **WHEN** a user saves a transaction through the UI
- **THEN** the transaction is persisted and appears in the transaction list, same as before

### Requirement: TransactionStore decomposto em responsabilidades únicas
O sistema SHALL separar a store monolítica `transactionStore.ts` em 4 stores especializadas com responsabilidade única cada.

#### Scenario: useTransactionStore gerencia apenas transações
- **GIVEN** o store `useTransactionStore` está inicializado
- **WHEN** componentes acessam transações e operações CRUD
- **THEN** o store contém apenas: `transactions`, `isLoading`, `searchQuery`, `fetchTransactionsByMonth`, `saveTransaction`, `deleteTransaction`, `activeTransactions`
- **AND** não contém referências a wallets, categories ou estatísticas

#### Scenario: useWalletStore gerencia apenas wallets
- **GIVEN** o store `useWalletStore` está inicializado
- **WHEN** componentes acessam carteiras
- **THEN** o store contém apenas: `wallets`, `walletMap`, `fetchWallets`
- **AND** não contém referências a transações ou categorias

#### Scenario: useCategoryStore gerencia apenas categorias
- **GIVEN** o store `useCategoryStore` está inicializado
- **WHEN** componentes acessam categorias
- **THEN** o store contém apenas: `categories`, `categoryMap`, `fetchCategories`
- **AND** não contém referências a transações ou wallets

#### Scenario: useTransactionStats calcula estatísticas derivadas
- **GIVEN** dados de transações disponíveis
- **WHEN** `useTransactionStats(transactions)` é instanciado
- **THEN** retorna: `totalIncome`, `totalExpense`, `monthlyBalance`, `topCategories`
- **AND** todas as computed properties usam apenas os dados passados via parâmetro

#### Scenario: Composição mantém compatibilidade de API
- **GIVEN** componentes legados importam `useTransactionStore`
- **WHEN** acessam campos que foram movidos para outras stores
- **THEN** `useTransactionStore` exporta os mesmos campos via composição/re-export
- **AND** comportamento observável permanece idêntico

#### Scenario: Reatividade preservada entre stores
- **GIVEN** `useTransactionStats` recebe `shallowRef<Transaction[]>`
- **WHEN** a ref de transações é atualizada
- **THEN** as computed properties de estatísticas recalculam automaticamente

### Requirement: Linhas de código reduzidas por store
Cada store especializada SHALL ter menos de 100 linhas de código.

#### Scenario: Store de transações compacta
- **WHEN** `useTransactionStore` é analisado
- **THEN** contém menos de 100 linhas (sem contar imports e exports)
- **AND** funções têm no máximo 20 linhas cada

#### Scenario: Store de wallets compacta
- **WHEN** `useWalletStore` é analisado
- **THEN** contém menos de 50 linhas
- **AND** responsabilidade única: gerenciamento de carteiras

#### Scenario: Store de categorias compacta
- **WHEN** `useCategoryStore` é analisado
- **THEN** contém menos de 50 linhas
- **AND** responsabilidade única: gerenciamento de categorias
