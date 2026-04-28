import { describe, it, expect, beforeEach } from 'vitest'
import { TransactionValidator, transactionValidator, type ValidationRule } from '../TransactionValidator'
import { ValidationError } from '@/core/errors'

describe('TransactionValidator', () => {
  let validator: TransactionValidator

  beforeEach(() => {
    validator = new TransactionValidator()
  })

  describe('Default Rules', () => {
    it('should validate required fields', () => {
      expect(() => {
        validator.validate('required', { field: 'title', value: 'Valid Title', params: {} })
      }).not.toThrow()

      expect(() => {
        validator.validate('required', { field: 'title', value: '', params: {} })
      }).toThrow(ValidationError)

      expect(() => {
        validator.validate('required', { field: 'title', value: null, params: {} })
      }).toThrow(ValidationError)
    })

    it('should validate transaction types', () => {
      expect(() => {
        validator.validate('transactionType', { field: 'type', value: 'income', params: {} })
      }).not.toThrow()

      expect(() => {
        validator.validate('transactionType', { field: 'type', value: 'expense', params: {} })
      }).not.toThrow()

      expect(() => {
        validator.validate('transactionType', { field: 'type', value: 'invalid', params: {} })
      }).toThrow(ValidationError)
    })

    it('should validate positive amounts', () => {
      expect(() => {
        validator.validate('positiveAmount', { field: 'amount', value: 100, params: {} })
      }).not.toThrow()

      expect(() => {
        validator.validate('positiveAmount', { field: 'amount', value: 0, params: {} })
      }).toThrow(ValidationError)

      expect(() => {
        validator.validate('positiveAmount', { field: 'amount', value: -10, params: {} })
      }).toThrow(ValidationError)
    })
  })

  describe('Custom Rules (OCP)', () => {
    it('should allow registering custom validation rules', () => {
      const customRule: ValidationRule = {
        name: 'maxAmount',
        validate: (context) => {
          const amount = context.value as number
          if (amount > 10000) return 'Amount exceeds maximum'
          return true
        }
      }

      validator.registerRule(customRule)

      expect(() => {
        validator.validate('maxAmount', { field: 'amount', value: 5000, params: {} })
      }).not.toThrow()

      expect(() => {
        validator.validate('maxAmount', { field: 'amount', value: 15000, params: {} })
      }).toThrow(ValidationError)
    })

    it('should track registered rules', () => {
      const rules = validator.getRegisteredRules()
      
      expect(rules).toContain('required')
      expect(rules).toContain('transactionType')
      expect(rules).toContain('positiveAmount')
    })

    it('should check if rule exists', () => {
      expect(validator.hasRule('required')).toBe(true)
      expect(validator.hasRule('nonexistent')).toBe(false)
    })

    it('should throw for unknown rules', () => {
      expect(() => {
        validator.validate('unknownRule', { field: 'test', value: 'value', params: {} })
      }).toThrow(ValidationError)
    })
  })

  describe('Global Instance', () => {
    it('should provide a singleton instance', () => {
      expect(transactionValidator).toBeInstanceOf(TransactionValidator)
      expect(transactionValidator.getRegisteredRules().length).toBeGreaterThan(0)
    })
  })
})
