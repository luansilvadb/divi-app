import { describe, it, expect } from 'vitest'
import { DI_TOKENS } from '../di-tokens'

describe('DI Tokens', () => {
  it('should export all required tokens', () => {
    expect(DI_TOKENS.AuthService).toBeDefined()
    expect(DI_TOKENS.TransactionRepository).toBeDefined()
    expect(DI_TOKENS.TransactionService).toBeDefined()
    expect(DI_TOKENS.WalletRepository).toBeDefined()
    expect(DI_TOKENS.WalletService).toBeDefined()
    expect(DI_TOKENS.CategoryRepository).toBeDefined()
    expect(DI_TOKENS.CategoryService).toBeDefined()
    expect(DI_TOKENS.PayeeRepository).toBeDefined()
    expect(DI_TOKENS.LoanRepository).toBeDefined()
    expect(DI_TOKENS.BudgetRepository).toBeDefined()
    expect(DI_TOKENS.GoalRepository).toBeDefined()
    expect(DI_TOKENS.GoalLogicService).toBeDefined()
    expect(DI_TOKENS.SubscriptionRepository).toBeDefined()
    expect(DI_TOKENS.ActivityLogService).toBeDefined()
    expect(DI_TOKENS.ExportService).toBeDefined()
    expect(DI_TOKENS.AssetLoader).toBeDefined()
    expect(DI_TOKENS.SyncEngine).toBeDefined()
    expect(DI_TOKENS.PredictionService).toBeDefined()
    expect(DI_TOKENS.Database).toBeDefined()
    expect(DI_TOKENS.VaultTransactionRepository).toBeDefined()
    expect(DI_TOKENS.LedgerTransactionService).toBeDefined()
    expect(DI_TOKENS.VaultCryptoManager).toBeDefined()
    expect(DI_TOKENS.AutoCreateService).toBeDefined()
  })

  it('should have consistent token values', () => {
    // Auth tokens
    expect(DI_TOKENS.AuthService).toBe('IAuthService')

    // Repository tokens should follow I prefix pattern
    expect(DI_TOKENS.TransactionRepository).toBe('ITransactionRepository')
    expect(DI_TOKENS.WalletRepository).toBe('IWalletRepository')
    expect(DI_TOKENS.CategoryRepository).toBe('ICategoryRepository')
    expect(DI_TOKENS.PayeeRepository).toBe('IPayeeRepository')
    expect(DI_TOKENS.LoanRepository).toBe('ILoanRepository')
    expect(DI_TOKENS.BudgetRepository).toBe('IBudgetRepository')
    expect(DI_TOKENS.GoalRepository).toBe('IGoalRepository')
    expect(DI_TOKENS.SubscriptionRepository).toBe('ISubscriptionRepository')

    // Service tokens
    expect(DI_TOKENS.WalletService).toBe('WalletService')
    expect(DI_TOKENS.CategoryService).toBe('CategoryService')
    expect(DI_TOKENS.TransactionService).toBe('TransactionService')
    expect(DI_TOKENS.ActivityLogService).toBe('IActivityLogService')
    expect(DI_TOKENS.GoalLogicService).toBe('IGoalLogicService')
    expect(DI_TOKENS.ExportService).toBe('ExportService')
    expect(DI_TOKENS.PredictionService).toBe('IPredictionService')
    expect(DI_TOKENS.AutoCreateService).toBe('AutoCreateService')
    expect(DI_TOKENS.LedgerTransactionService).toBe('LedgerTransactionService')

    // Other tokens
    expect(DI_TOKENS.AssetLoader).toBe('IAssetLoader')
    expect(DI_TOKENS.SyncEngine).toBe('ISyncEngine')
    expect(DI_TOKENS.Database).toBe('IVaultDatabase')
    expect(DI_TOKENS.VaultTransactionRepository).toBe('VaultTransactionRepository')
    expect(DI_TOKENS.VaultCryptoManager).toBe('IVaultCryptoManager')
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
      DI_TOKENS.AuthService = 'Modified'
    }).toThrow() // Object.freeze() throws TypeError in strict mode

    // Value should remain unchanged
    expect(DI_TOKENS.AuthService).toBe('IAuthService')
  })
})
