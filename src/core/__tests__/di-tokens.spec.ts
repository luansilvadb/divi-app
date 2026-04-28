import { describe, it, expect } from 'vitest'
import { DI_TOKENS } from '../di-tokens'

describe('DI Tokens', () => {
  it('should export all required tokens', () => {
    expect(DI_TOKENS.IAuthService).toBeDefined()
    expect(DI_TOKENS.ITransactionRepository).toBeDefined()
    expect(DI_TOKENS.ITransactionService).toBeDefined()
    expect(DI_TOKENS.IWalletRepository).toBeDefined()
    expect(DI_TOKENS.IWalletService).toBeDefined()
    expect(DI_TOKENS.ICategoryRepository).toBeDefined()
    expect(DI_TOKENS.ICategoryService).toBeDefined()
    expect(DI_TOKENS.IPayeeRepository).toBeDefined()
    expect(DI_TOKENS.ILoanRepository).toBeDefined()
    expect(DI_TOKENS.IBudgetRepository).toBeDefined()
    expect(DI_TOKENS.IGoalRepository).toBeDefined()
    expect(DI_TOKENS.IGoalLogicService).toBeDefined()
    expect(DI_TOKENS.ISubscriptionRepository).toBeDefined()
    expect(DI_TOKENS.IActivityLogService).toBeDefined()
    expect(DI_TOKENS.IExportService).toBeDefined()
    expect(DI_TOKENS.IAssetLoader).toBeDefined()
    expect(DI_TOKENS.ISyncEngine).toBeDefined()
    expect(DI_TOKENS.IPredictionService).toBeDefined()
    expect(DI_TOKENS.IDatabase).toBeDefined()
    expect(DI_TOKENS.IVaultTransactionRepository).toBeDefined()
    expect(DI_TOKENS.ILedgerTransactionService).toBeDefined()
    expect(DI_TOKENS.IVaultCryptoManager).toBeDefined()
    expect(DI_TOKENS.IAutoCreateService).toBeDefined()
    expect(DI_TOKENS.IDashboardService).toBeDefined()
  })

  it('should have consistent token values', () => {
    // Auth tokens
    expect(DI_TOKENS.IAuthService).toBe('IAuthService')

    // Repository tokens should follow I prefix pattern
    expect(DI_TOKENS.ITransactionRepository).toBe('ITransactionRepository')
    expect(DI_TOKENS.IWalletRepository).toBe('IWalletRepository')
    expect(DI_TOKENS.ICategoryRepository).toBe('ICategoryRepository')
    expect(DI_TOKENS.IPayeeRepository).toBe('IPayeeRepository')
    expect(DI_TOKENS.ILoanRepository).toBe('ILoanRepository')
    expect(DI_TOKENS.IBudgetRepository).toBe('IBudgetRepository')
    expect(DI_TOKENS.IGoalRepository).toBe('IGoalRepository')
    expect(DI_TOKENS.ISubscriptionRepository).toBe('ISubscriptionRepository')

    // Service tokens
    expect(DI_TOKENS.IWalletService).toBe('IWalletService')
    expect(DI_TOKENS.ICategoryService).toBe('ICategoryService')
    expect(DI_TOKENS.ITransactionService).toBe('ITransactionService')
    expect(DI_TOKENS.IActivityLogService).toBe('IActivityLogService')
    expect(DI_TOKENS.IGoalLogicService).toBe('IGoalLogicService')
    expect(DI_TOKENS.IExportService).toBe('IExportService')
    expect(DI_TOKENS.IPredictionService).toBe('IPredictionService')
    expect(DI_TOKENS.IAutoCreateService).toBe('IAutoCreateService')
    expect(DI_TOKENS.IDashboardService).toBe('IDashboardService')
    expect(DI_TOKENS.ILedgerTransactionService).toBe('ILedgerTransactionService')

    // Other tokens
    expect(DI_TOKENS.IAssetLoader).toBe('IAssetLoader')
    expect(DI_TOKENS.ISyncEngine).toBe('ISyncEngine')
    expect(DI_TOKENS.IDatabase).toBe('IDatabase')
    expect(DI_TOKENS.IVaultTransactionRepository).toBe('IVaultTransactionRepository')
    expect(DI_TOKENS.IVaultCryptoManager).toBe('IVaultCryptoManager')
  })

  it('should have unique token values', () => {
    const values = Object.values(DI_TOKENS)
    const uniqueValues = new Set(values)
    expect(uniqueValues.size).toBe(values.length)
  })

  it('should be frozen and prevent modifications', () => {
    // Object.freeze() ensures runtime immutability
    expect(() => {
      // @ts-expect-error - Testing immutability
      DI_TOKENS.IAuthService = 'Modified'
    }).toThrow() // Object.freeze() throws TypeError in strict mode

    // Value should remain unchanged
    expect(DI_TOKENS.IAuthService).toBe('IAuthService')
  })
})
