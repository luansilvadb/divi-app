/**
 * Simple Dependency Injection (DI) Container
 * Facilitates strict layer isolation according to Clean Architecture
 */

import { SupabaseAuthService } from '../modules/finance/infrastructure/services/SupabaseAuthService'
import { 
  DexieSupabaseTransactionRepository, 
  DexieWalletRepository, 
  DexieCategoryRepository 
} from '../modules/finance/infrastructure/repositories/index'
import { DexiePayeeRepository } from '../modules/finance/infrastructure/repositories/PayeeRepository'
import { DexieLoanRepository } from '../modules/finance/infrastructure/repositories/LoanRepository'
import { DexieSubscriptionRepository } from '../modules/finance/infrastructure/repositories/SubscriptionRepository'
import { ActivityLogService } from '../modules/finance/application/services/ActivityLogService'
import { ExportService } from '../modules/finance/application/services/ExportService'

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

// Register foundational services
container.register('IAuthService', new SupabaseAuthService())
container.register('ITransactionRepository', new DexieSupabaseTransactionRepository())
container.register('IWalletRepository', new DexieWalletRepository())
container.register('ICategoryRepository', new DexieCategoryRepository())
container.register('IPayeeRepository', new DexiePayeeRepository())
container.register('ILoanRepository', new DexieLoanRepository())
container.register('ISubscriptionRepository', new DexieSubscriptionRepository())
container.register('IActivityLogService', new ActivityLogService())
container.register('ExportService', new ExportService())

// Helper to provide/inject services in Vue components if needed
export const useService = <T>(token: Token<T>): T => container.resolve(token)
