/**
 * DI Tokens for the application
 * Using string tokens allows for complete decoupling between layers
 */

export const DI_TOKENS = Object.freeze({
  AuthService: 'IAuthService',
  TransactionRepository: 'ITransactionRepository',
  WalletRepository: 'IWalletRepository',
  WalletService: 'WalletService',
  CategoryRepository: 'ICategoryRepository',
  CategoryService: 'CategoryService',
  TransactionService: 'TransactionService',
  PayeeRepository: 'IPayeeRepository',
  LoanRepository: 'ILoanRepository',
  BudgetRepository: 'IBudgetRepository',
  GoalRepository: 'IGoalRepository',
  GoalLogicService: 'IGoalLogicService',
  SubscriptionRepository: 'ISubscriptionRepository',
  ActivityLogService: 'IActivityLogService',
  ExportService: 'ExportService',
  AssetLoader: 'IAssetLoader',
  SyncEngine: 'ISyncEngine',
  PredictionService: 'IPredictionService',
  Database: 'IVaultDatabase',
  VaultTransactionRepository: 'VaultTransactionRepository',
  LedgerTransactionService: 'LedgerTransactionService',
  VaultCryptoManager: 'IVaultCryptoManager',
  AutoCreateService: 'AutoCreateService',
} as const)
