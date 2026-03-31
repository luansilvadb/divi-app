/**
 * Simple Dependency Injection (DI) Container
 * Facilitates strict layer isolation according to Clean Architecture
 */

import { SupabaseAuthService } from '../modules/auth/infrastructure/services/SupabaseAuthService'
import {
  DexieSupabaseTransactionRepository,
  DexieWalletRepository,
  DexieCategoryRepository,
} from '../modules/transactions/infrastructure/repositories/index'
import { DexiePayeeRepository } from '../modules/transactions/infrastructure/repositories/PayeeRepository'
import { DexieLoanRepository } from '../modules/loans/infrastructure/repositories/DexieLoanRepository'
import { DexieBudgetRepository } from '../modules/budgets/infrastructure/repositories/DexieBudgetRepository'
import { DexieGoalRepository } from '../modules/goals/infrastructure/repositories/DexieGoalRepository'
import { DexieSubscriptionRepository } from '../modules/subscriptions/infrastructure/repositories/DexieSubscriptionRepository'
import { ActivityLogService } from '../modules/activity-log/application/services/ActivityLogService'
import { ExportService } from '../modules/transactions/application/services/ExportService'
import { BudgetLogicService } from '../modules/budgets/application/services/BudgetLogicService'
import { GoalLogicService } from '../modules/goals/application/services/GoalLogicService'

type Token<T = any> = string | (new (...args: any[]) => T)

class Container {
  private services = new Map<string, any>()

  /**
   * Register a service by token or class reference
   */
  register<T>(token: Token<T>, instance: T): void {
    const key = typeof token === 'string' ? token : token.name
    this.services.set(key, instance)
    console.debug(`[DI] Registered: ${key}`)
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
    return service
  }
}

export const container = new Container()

import { DI_TOKENS } from './di-tokens'

// To maintain compatibility with existing code during migration, 
// we register both with the string from DI_TOKENS and the explicit string.
container.register(DI_TOKENS.AuthService, new SupabaseAuthService())
container.register(DI_TOKENS.TransactionRepository, new DexieSupabaseTransactionRepository())
container.register(DI_TOKENS.WalletRepository, new DexieWalletRepository())
container.register(DI_TOKENS.CategoryRepository, new DexieCategoryRepository())
container.register(DI_TOKENS.PayeeRepository, new DexiePayeeRepository())
container.register(DI_TOKENS.LoanRepository, new DexieLoanRepository())
container.register(DI_TOKENS.BudgetRepository, new DexieBudgetRepository())
container.register(DI_TOKENS.GoalRepository, new DexieGoalRepository())
container.register(DI_TOKENS.BudgetLogicService, new BudgetLogicService())
container.register(DI_TOKENS.GoalLogicService, new GoalLogicService())
container.register(DI_TOKENS.SubscriptionRepository, new DexieSubscriptionRepository())
container.register(DI_TOKENS.ActivityLogService, new ActivityLogService())
container.register(DI_TOKENS.ExportService, new ExportService())

// Helper to provide/inject services in Vue components if needed
export const useService = <T>(token: Token<T>): T => container.resolve(token)
