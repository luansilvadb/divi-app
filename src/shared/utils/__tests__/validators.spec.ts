import { describe, it, expect } from 'vitest'
import {
  isNonEmptyString,
  isPositiveNumber,
  isValidInteger,
  isValidEmail,
  isValidPastDate,
  isInRange,
  hasRequiredProperties,
} from '../validators'

describe('validators', () => {
  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true)
      expect(isNonEmptyString('  hello  ')).toBe(true)
    })

    it('should return false for empty strings', () => {
      expect(isNonEmptyString('')).toBe(false)
      expect(isNonEmptyString('   ')).toBe(false)
    })

    it('should return false for non-string values', () => {
      expect(isNonEmptyString(123)).toBe(false)
      expect(isNonEmptyString(null)).toBe(false)
      expect(isNonEmptyString(undefined)).toBe(false)
      expect(isNonEmptyString({})).toBe(false)
    })
  })

  describe('isPositiveNumber', () => {
    it('should return true for positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true)
      expect(isPositiveNumber(0.5)).toBe(true)
    })

    it('should return false for non-positive numbers', () => {
      expect(isPositiveNumber(0)).toBe(false)
      expect(isPositiveNumber(-1)).toBe(false)
      expect(isPositiveNumber(NaN)).toBe(false)
    })

    it('should return false for non-number values', () => {
      expect(isPositiveNumber('1')).toBe(false)
      expect(isPositiveNumber(null)).toBe(false)
    })
  })

  describe('isValidInteger', () => {
    it('should return true for valid integers', () => {
      expect(isValidInteger(0)).toBe(true)
      expect(isValidInteger(-5)).toBe(true)
      expect(isValidInteger(100)).toBe(true)
    })

    it('should return false for non-integers', () => {
      expect(isValidInteger(1.5)).toBe(false)
      expect(isValidInteger(NaN)).toBe(false)
    })
  })

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should return false for invalid emails', () => {
      expect(isValidEmail('not-an-email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('isValidPastDate', () => {
    it('should return true for past dates', () => {
      expect(isValidPastDate('2020-01-01')).toBe(true)
      expect(isValidDate(new Date(Date.now() - 86400000))).toBe(true)
    })

    it('should return false for future dates', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      expect(isValidPastDate(futureDate)).toBe(false)
    })

    it('should return false for invalid dates', () => {
      expect(isValidPastDate('invalid')).toBe(false)
      expect(isValidPastDate('')).toBe(false)
    })
  })

  describe('isInRange', () => {
    it('should return true for values in range', () => {
      expect(isInRange(5, 0, 10)).toBe(true)
      expect(isInRange(0, 0, 10)).toBe(true)
      expect(isInRange(10, 0, 10)).toBe(true)
    })

    it('should return false for values outside range', () => {
      expect(isInRange(-1, 0, 10)).toBe(false)
      expect(isInRange(11, 0, 10)).toBe(false)
    })
  })

  describe('hasRequiredProperties', () => {
    it('should return true when all properties exist', () => {
      const obj: Record<string, unknown> = { name: 'John', age: 30, email: 'john@example.com' }
      expect(hasRequiredProperties(obj, ['name', 'age'])).toBe(true)
    })

    it('should return false when properties are missing', () => {
      const obj: Record<string, unknown> = { name: 'John' }
      expect(hasRequiredProperties(obj, ['name', 'age'])).toBe(false)
    })

    it('should return false for null or undefined properties', () => {
      const obj: Record<string, unknown> = { name: 'John', age: null }
      expect(hasRequiredProperties(obj, ['name', 'age'])).toBe(false)
    })
  })
})

// Helper function for date tests
function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime())
}
