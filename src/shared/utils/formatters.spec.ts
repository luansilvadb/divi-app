import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCurrencySign, formatDate, formatDateShort, getRelativeDayLabel } from './formatters'

// Helper to normalize non-breaking spaces in currency strings
function normalizeCurrency(str: string): string {
  return str.replace(/\u00A0/g, ' ')
}

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format bigint cents as BRL currency', () => {
      expect(normalizeCurrency(formatCurrency(12345n))).toBe('R$ 123,45')
      expect(normalizeCurrency(formatCurrency(100n))).toBe('R$ 1,00')
      expect(normalizeCurrency(formatCurrency(0n))).toBe('R$ 0,00')
    })

    it('should format number as BRL currency', () => {
      expect(normalizeCurrency(formatCurrency(123.45))).toBe('R$ 123,45')
      expect(normalizeCurrency(formatCurrency(1))).toBe('R$ 1,00')
      expect(normalizeCurrency(formatCurrency(0))).toBe('R$ 0,00')
    })

    it('should handle large values', () => {
      expect(normalizeCurrency(formatCurrency(99999999n))).toBe('R$ 999.999,99')
      expect(normalizeCurrency(formatCurrency(100000000n))).toBe('R$ 1.000.000,00')
    })

    it('should handle negative values', () => {
      expect(normalizeCurrency(formatCurrency(-12345n))).toBe('-R$ 123,45')
      expect(normalizeCurrency(formatCurrency(-123.45))).toBe('-R$ 123,45')
    })
  })

  describe('formatCurrencySign', () => {
    it('should always show sign for positive values', () => {
      expect(normalizeCurrency(formatCurrencySign(12345n))).toBe('+R$ 123,45')
      expect(normalizeCurrency(formatCurrencySign(100n))).toBe('+R$ 1,00')
    })

    it('should always show sign for negative values', () => {
      expect(normalizeCurrency(formatCurrencySign(-12345n))).toBe('-R$ 123,45')
    })

    it('should show sign for zero', () => {
      expect(normalizeCurrency(formatCurrencySign(0n))).toBe('+R$ 0,00')
    })
  })

  describe('formatDate', () => {
    it('should format ISO date string to pt-BR format', () => {
      // Using a midday time to avoid timezone issues
      expect(formatDate('2024-03-15T12:00:00')).toBe('15/03/2024')
      expect(formatDate('2024-12-01T12:00:00')).toBe('01/12/2024')
    })

    it('should handle empty string', () => {
      expect(formatDate('')).toBe('')
    })

    it('should return formatted date string', () => {
      const result = formatDate('2024-03-15T10:30:00')
      // Result depends on local timezone, just verify it's not empty and has the expected pattern
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
    })
  })

  describe('formatDateShort', () => {
    it('should format date to short representation', () => {
      expect(formatDateShort('2024-03-15T12:00:00')).toBe('15 MAR')
      expect(formatDateShort('2024-12-01T12:00:00')).toBe('01 DEZ')
    })

    it('should handle empty string', () => {
      expect(formatDateShort('')).toBe('')
    })
  })

  describe('getRelativeDayLabel', () => {
    it('should return "Hoje" for today', () => {
      const today = new Date()
      today.setHours(12, 0, 0, 0)
      expect(getRelativeDayLabel(today.toISOString().slice(0, 10))).toBe('Hoje')
    })

    it('should return "Ontem" for yesterday', () => {
      const yesterday = new Date()
      yesterday.setHours(12, 0, 0, 0)
      yesterday.setDate(yesterday.getDate() - 1)
      expect(getRelativeDayLabel(yesterday.toISOString().slice(0, 10))).toBe('Ontem')
    })

    it('should return day number for other dates', () => {
      expect(getRelativeDayLabel('2024-03-15T12:00:00')).toBe('15')
    })

    it('should handle empty string', () => {
      expect(getRelativeDayLabel('')).toBe('')
    })
  })
})
