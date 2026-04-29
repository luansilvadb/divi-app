/**
 * Simple Dependency Injection (DI) Container
 * Facilitates strict layer isolation according to Clean Architecture
 */

import { supabase } from './supabase'
import { SupabaseAuthService } from '../modules/auth/adapters/SupabaseAuthService'
import { AuthService } from '../modules/auth/core/services/AuthService'
import { DexieTransactionRepository } from '../modules/transactions/adapters/DexieTransactionRepository'
import { DexieWalletRepository } from '../modules/wallets/adapters/DexieWalletRepository'
import { DexieCategoryRepository } from '../modules/categories/adapters/DexieCategoryRepository'
import { DexiePayeeRepository } from '../modules/transactions/adapters/DexiePayeeRepository'
import { TransactionService } from '../modules/transactions/core/services/TransactionService'
import { WalletService } from '../modules/wallets/application/services/WalletService'
import { CategoryService } from '../modules/categories/application/services/CategoryService'
import { DexieLoanRepository } from '../modules/loans/adapters/DexieLoanRepository'
import { DexieBudgetRepository } from '../modules/budgets/adapters/DexieBudgetRepository'
import { DexieGoalRepository } from '../modules/goals/adapters/DexieGoalRepository'
import { DexieSubscriptionRepository } from '../modules/subscriptions/adapters/DexieSubscriptionRepository'
import { ActivityLogService } from '../modules/activity-log/application/services/ActivityLogService'
import { ExportService } from '../modules/transactions/application/services/ExportService'
import { AssetLoader } from '../shared/utils/asset-loader'
import { GoalLogicService } from '../modules/goals/application/services/GoalLogicService'
import { SyncEngine } from './sync/SyncEngine'
import { PredictionService } from '../modules/transactions/application/PredictionService'
import { vaultDb } from '../infrastructure/storage/VaultDatabase'
import { VaultCryptoManager } from '../infrastructure/crypto/VaultCryptoManager'
import { AutoCreateService } from '../modules/transactions/core/services/AutoCreateService'
import { AutoCategorizationService } from '../modules/transactions/core/services/AutoCategorizationService'
import { ConsoleLogger } from '../infrastructure/logging/ConsoleLogger'

import { DI_TOKENS } from './di-tokens'

export interface IDIContainer {
  register<T>(token: string, implementation: T): void;
  resolve<T>(token: string): T;
}

class Container implements IDIContainer {
  private services = new Map<string, unknown>()

  /**
   * Register a service by token
   */
  register<T>(token: string, implementation: T): void {
    this.services.set(token, implementation)
  }

  /**
   * Resolve a service by token
   */
  resolve<T>(token: string): T {
    const service = this.services.get(token)
    if (!service) {
      throw new Error(`[DI] Service not found: ${token}`)
    }
    return service as T
  }
}

export const container = new Container()

// Composition Root - Wiring things up

// Auth
const supabaseAuthAdapter = new SupabaseAuthService(supabase)
const authService = new AuthService(supabaseAuthAdapter)
container.register(DI_TOKENS.IAuthService, authService)

// transactions
const transactionRepo = new DexieTransactionRepository()
container.register(DI_TOKENS.ITransactionRepository, transactionRepo)
container.register(DI_TOKENS.ITransactionService, new TransactionService(transactionRepo, authService))
container.register(DI_TOKENS.IAutoCategorizationService, new AutoCategorizationService())

// wallets
const walletRepo = new DexieWalletRepository()
container.register(DI_TOKENS.IWalletRepository, walletRepo)
container.register(DI_TOKENS.IWalletService, new WalletService(walletRepo))

// Categories
const categoryRepo = new DexieCategoryRepository()
container.register(DI_TOKENS.ICategoryRepository, categoryRepo)
container.register(DI_TOKENS.ICategoryService, new CategoryService(categoryRepo))

// Others
container.register(DI_TOKENS.IPayeeRepository, new DexiePayeeRepository())
container.register(DI_TOKENS.ILoanRepository, new DexieLoanRepository())
container.register(DI_TOKENS.IBudgetRepository, new DexieBudgetRepository())
container.register(DI_TOKENS.IGoalRepository, new DexieGoalRepository())
container.register(DI_TOKENS.IGoalLogicService, new GoalLogicService())
container.register(DI_TOKENS.ISubscriptionRepository, new DexieSubscriptionRepository())

import { DexieActivityRepository } from '../modules/activity-log/adapters/DexieActivityRepository'
const activityRepo = new DexieActivityRepository()
const activityLogService = new ActivityLogService(activityRepo)
container.register(DI_TOKENS.IActivityLogService, activityLogService)
container.register(DI_TOKENS.IAssetLoader, new AssetLoader(activityLogService))
container.register(DI_TOKENS.IExportService, new ExportService())
container.register(DI_TOKENS.ISyncEngine, new SyncEngine())
container.register(DI_TOKENS.IDatabase, vaultDb)
container.register(DI_TOKENS.IPredictionService, new PredictionService(vaultDb))
container.register(DI_TOKENS.IVaultCryptoManager, new VaultCryptoManager())
container.register(DI_TOKENS.IAutoCreateService, new AutoCreateService(
  container.resolve(DI_TOKENS.ICategoryService),
  container.resolve(DI_TOKENS.IWalletService),
))

import { DashboardService } from '../modules/dashboard/core/services/DashboardService'
container.register(DI_TOKENS.IDashboardService, new DashboardService(
  container.resolve(DI_TOKENS.IWalletRepository),
  container.resolve(DI_TOKENS.ILoanRepository)
))

// Infrastructure
container.register(DI_TOKENS.ILogger, new ConsoleLogger('Global'))

// Helper to provide/inject services in Vue components
export const useService = <T>(token: string): T => container.resolve<T>(token)
