/**
 * Simple Dependency Injection (DI) Container
 * Facilitates strict layer isolation according to Clean Architecture
 */

import { SupabaseAuthService } from '../modules/auth/infrastructure/services/SupabaseAuthService'
import { DexieTransactionRepository } from '../modules/transactions/infrastructure/DexieTransactionRepository'
import {
  DexieWalletRepository,
  DexieCategoryRepository,
} from '../modules/transactions/infrastructure/repositories/DexieMetadataRepositories'
import { TransactionService } from '../modules/transactions/application/services/TransactionService'
import { WalletService } from '../modules/wallets/application/services/WalletService'
import { CategoryService } from '../modules/categories/application/services/CategoryService'
import { DexiePayeeRepository } from '../modules/transactions/infrastructure/repositories/PayeeRepository'
import { DexieLoanRepository } from '../modules/loans/infrastructure/repositories/DexieLoanRepository'
import { DexieBudgetRepository } from '../modules/budgets/infrastructure/repositories/DexieBudgetRepository'
import { DexieGoalRepository } from '../modules/goals/infrastructure/repositories/DexieGoalRepository'
import { DexieSubscriptionRepository } from '../modules/subscriptions/infrastructure/repositories/DexieSubscriptionRepository'
import { ActivityLogService } from '../modules/activity-log/application/services/ActivityLogService'
import { ExportService } from '../modules/transactions/application/services/ExportService'
import { AssetLoader } from '../shared/utils/asset-loader'
import { GoalLogicService } from '../modules/goals/application/services/GoalLogicService'
import { SyncEngine } from './sync/SyncEngine'
import { PredictionService } from '../modules/transactions/application/PredictionService'
import { vaultDb } from '../infrastructure/storage/VaultDatabase'
import { VaultTransactionRepository } from '../modules/ledger/infrastructure/repositories/VaultTransactionRepository'
import { TransactionService as LedgerTransactionService } from '../modules/ledger/application/services/TransactionService'
import { VaultCryptoManager } from '../infrastructure/crypto/VaultCryptoManager'
import { AutoCreateService } from '../modules/transactions/application/services/AutoCreateService'

import { DI_TOKENS } from './di-tokens'

type Token<T = unknown> = string | (new (...args: unknown[]) => T)

class Container {
  private services = new Map<string, unknown>()

  /**
   * Register a service by token or class reference
   */
  register<T>(token: Token<T>, instance: T): void {
    const key = typeof token === 'string' ? token : token.name
    this.services.set(key, instance)
  }

  /**
   * Resolve a service by token or class reference
   */
  resolve<T>(token: Token<T>): T {
    const key = typeof token === 'string' ? token : token.name
    const service = this.services.get(key)
    if (!service) {
      throw new Error(`[DI] Service not found: ${key}`)
    }
    return service as T
  }
}

export const container = new Container()

// To maintain compatibility with existing code during migration,
// we register both with the string from DI_TOKENS and the explicit string.
container.register(DI_TOKENS.AuthService, new SupabaseAuthService())
const transactionRepo = new DexieTransactionRepository()
container.register(DI_TOKENS.TransactionRepository, transactionRepo)
container.register(DI_TOKENS.TransactionService, new TransactionService(transactionRepo))

const vaultTransactionRepo = new VaultTransactionRepository()
container.register(DI_TOKENS.VaultTransactionRepository, vaultTransactionRepo)
container.register(DI_TOKENS.LedgerTransactionService, new LedgerTransactionService(vaultTransactionRepo))

const walletRepo = new DexieWalletRepository()
container.register(DI_TOKENS.WalletRepository, walletRepo)
container.register(DI_TOKENS.WalletService, new WalletService(walletRepo))

const categoryRepo = new DexieCategoryRepository()
container.register(DI_TOKENS.CategoryRepository, categoryRepo)
container.register(DI_TOKENS.CategoryService, new CategoryService(categoryRepo))
container.register(DI_TOKENS.PayeeRepository, new DexiePayeeRepository())
container.register(DI_TOKENS.LoanRepository, new DexieLoanRepository())
container.register(DI_TOKENS.BudgetRepository, new DexieBudgetRepository())
container.register(DI_TOKENS.GoalRepository, new DexieGoalRepository())
container.register(DI_TOKENS.GoalLogicService, new GoalLogicService())
container.register(DI_TOKENS.SubscriptionRepository, new DexieSubscriptionRepository())
const activityLogService = new ActivityLogService()
container.register(DI_TOKENS.ActivityLogService, activityLogService)
container.register(DI_TOKENS.AssetLoader, new AssetLoader(activityLogService))
container.register(DI_TOKENS.ExportService, new ExportService())
container.register(DI_TOKENS.SyncEngine, new SyncEngine())
container.register(DI_TOKENS.Database, vaultDb)
container.register(DI_TOKENS.PredictionService, new PredictionService(vaultDb))
container.register(DI_TOKENS.VaultCryptoManager, new VaultCryptoManager())
container.register(DI_TOKENS.AutoCreateService, new AutoCreateService(
  container.resolve<CategoryService>(DI_TOKENS.CategoryService),
  container.resolve<WalletService>(DI_TOKENS.WalletService),
))

// Helper to provide/inject services in Vue components if needed
export const useService = <T>(token: Token<T>): T => container.resolve(token)
