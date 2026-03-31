/**
 * DI Tokens for the application
 * Using string tokens allows for complete decoupling between layers
 */

export const DI_TOKENS = {
  AuthService: 'IAuthService',
  TransactionRepository: 'ITransactionRepository',
  WalletRepository: 'IWalletRepository',
  CategoryRepository: 'ICategoryRepository',
  PayeeRepository: 'IPayeeRepository',
  LoanRepository: 'ILoanRepository',
  BudgetRepository: 'IBudgetRepository',
  GoalRepository: 'IGoalRepository',
  BudgetLogicService: 'IBudgetLogicService',
  GoalLogicService: 'IGoalLogicService',
  SubscriptionRepository: 'ISubscriptionRepository',
  ActivityLogService: 'IActivityLogService',
  ExportService: 'ExportService',
  AssetLoader: 'IAssetLoader',
} as const
