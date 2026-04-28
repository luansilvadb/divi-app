import { describe, it, expect } from 'vitest'
import {
  safeJsonParse,
  parseDate,
  parseNumber,
  parseBoolean,
  extractInitials,
  normalizeString,
} from '../parsers'

describe('parsers', () => {
  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      expect(safeJsonParse('{"name":"test"}', {})).toEqual({ name: 'test' })
      expect(safeJsonParse('[1,2,3]', [])).toEqual([1, 2, 3])
    })

    it('should return fallback for invalid JSON', () => {
      expect(safeJsonParse('invalid', { fallback: true })).toEqual({ fallback: true })
      expect(safeJsonParse('', [])).toEqual([])
    })
  })

  describe('parseDate', () => {
    it('should parse valid date strings', () => {
      const result = parseDate('2023-01-15')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2023)
    })

    it('should parse timestamps', () => {
      const timestamp = Date.now()
      const result = parseDate(timestamp)
      expect(result).toBeInstanceOf(Date)
    })

    it('should return null for invalid dates', () => {
      expect(parseDate('invalid')).toBeNull()
      expect(parseDate('')).toBeNull()
      expect(parseDate(null)).toBeNull()
      expect(parseDate(undefined)).toBeNull()
    })
  })

  describe('parseNumber', () => {
    it('should parse valid numbers from string', () => {
      expect(parseNumber('42')).toBe(42)
      expect(parseNumber('3.14')).toBe(3.14)
      expect(parseNumber('-10')).toBe(-10)
    })

    it('should return numbers as-is', () => {
      expect(parseNumber(42)).toBe(42)
      expect(parseNumber(3.14)).toBe(3.14)
    })

    it('should return null for invalid numbers', () => {
      expect(parseNumber('not-a-number')).toBeNull()
      expect(parseNumber('')).toBeNull()
      expect(parseNumber(null)).toBeNull()
      expect(parseNumber(undefined)).toBeNull()
    })
  })

  describe('parseBoolean', () => {
    it('should return booleans as-is', () => {
      expect(parseBoolean(true)).toBe(true)
      expect(parseBoolean(false)).toBe(false)
    })

    it('should parse string representations', () => {
      expect(parseBoolean('true')).toBe(true)
      expect(parseBoolean('TRUE')).toBe(true)
      expect(parseBoolean('1')).toBe(true)
      expect(parseBoolean('false')).toBe(false)
      expect(parseBoolean('0')).toBe(false)
    })

    it('should parse numbers', () => {
      expect(parseBoolean(1)).toBe(true)
      expect(parseBoolean(0)).toBe(false)
      expect(parseBoolean(-5)).toBe(true)
    })

    it('should return false for null/undefined', () => {
      expect(parseBoolean(null)).toBe(false)
      expect(parseBoolean(undefined)).toBe(false)
    })
  })

  describe('extractInitials', () => {
    it('should extract initials from names', () => {
      expect(extractInitials('John Doe')).toBe('JD')
      expect(extractInitials('Mary Jane Watson')).toBe('MJ')
    })

    it('should handle single names', () => {
      expect(extractInitials('John')).toBe('J')
    })

    it('should handle empty strings', () => {
      expect(extractInitials('')).toBe('')
    })

    it('should respect max initials limit', () => {
      expect(extractInitials('John Michael Peter', 2)).toBe('JM')
      expect(extractInitials('John Michael Peter', 1)).toBe('J')
    })
  })

  describe('normalizeString', () => {
    it('should lowercase strings', () => {
      expect(normalizeString('HELLO')).toBe('hello')
    })

    it('should remove accents', () => {
      expect(normalizeString('café')).toBe('cafe')
      expect(normalizeString('naïve')).toBe('naive')
    })

    it('should trim whitespace', () => {
      expect(normalizeString('  hello  ')).toBe('hello')
    })
  })
})
