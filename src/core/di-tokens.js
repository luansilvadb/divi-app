"use strict";
/**
 * DI Tokens for the application
 * Using string tokens allows for complete decoupling between layers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DI_TOKENS = void 0;
exports.DI_TOKENS = {
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
};
