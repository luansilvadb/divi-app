import { describe, it, expect, beforeEach } from 'vitest'
import { container, useService } from '../di'
import { DI_TOKENS } from '../di-tokens'

describe('DI Container', () => {
  beforeEach(() => {
    // Clear any test registrations
  })

  describe('Container registration', () => {
    it('should register and resolve a service by string token', () => {
      const mockService = { name: 'TestService' }
      container.register('TestToken', mockService)

      const resolved = container.resolve('TestToken')
      expect(resolved).toBe(mockService)
    })

    it('should register and resolve a service by class reference', () => {
      class TestClass {
        value = 'test'
      }
      const instance = new TestClass()
      container.register(TestClass, instance)

      const resolved = container.resolve(TestClass)
      expect(resolved).toBe(instance)
    })

    it('should resolve the same instance for singleton services', () => {
      const singleton = { id: Math.random() }
      container.register('SingletonToken', singleton)

      const resolved1 = container.resolve('SingletonToken')
      const resolved2 = container.resolve('SingletonToken')

      expect(resolved1).toBe(resolved2)
    })
  })

  describe('Container resolution', () => {
    it('should throw error when service is not found', () => {
      expect(() => container.resolve('NonExistentToken')).toThrow(
        '[DI] Service not found: NonExistentToken'
      )
    })

    it('should throw error when service was never registered', () => {
      expect(() => container.resolve('UnregisteredToken')).toThrow()
    })
  })

  describe('useService helper', () => {
    it('should resolve service using useService helper', () => {
      const mockService = { helper: true }
      container.register('HelperToken', mockService)

      const resolved = useService('HelperToken')
      expect(resolved).toBe(mockService)
    })

    it('should work with DI_TOKENS constants', () => {
      // DI_TOKENS.AuthService is registered in the container initialization
      const authService = useService(DI_TOKENS.AuthService)
      expect(authService).toBeDefined()
    })
  })

  describe('Real services registration', () => {
    it('should have AuthService registered', () => {
      const authService = container.resolve(DI_TOKENS.AuthService)
      expect(authService).toBeDefined()
    })

    it('should have TransactionService registered', () => {
      const transactionService = container.resolve(DI_TOKENS.TransactionService)
      expect(transactionService).toBeDefined()
    })

    it('should have WalletService registered', () => {
      const walletService = container.resolve(DI_TOKENS.WalletService)
      expect(walletService).toBeDefined()
    })

    it('should have CategoryService registered', () => {
      const categoryService = container.resolve(DI_TOKENS.CategoryService)
      expect(categoryService).toBeDefined()
    })

    it('should have ActivityLogService registered', () => {
      const activityLogService = container.resolve(DI_TOKENS.ActivityLogService)
      expect(activityLogService).toBeDefined()
    })

    it('should have Database registered', () => {
      const database = container.resolve(DI_TOKENS.Database)
      expect(database).toBeDefined()
    })
  })
})
