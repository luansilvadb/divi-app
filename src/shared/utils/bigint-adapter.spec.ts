import { describe, it, expect } from 'vitest'
import { BigIntAdapter } from './bigint-adapter'

describe('BigIntAdapter', () => {
  describe('parseDecimalToBigInt', () => {
    it('should convert decimal string to BigInt correctly (minor units)', () => {
      // Teste para certificar que os arredondamentos decimal -> bigint são infalíveis
      expect(BigIntAdapter.parseDecimalToBigInt('15.50')).toBe(1550n)
      expect(BigIntAdapter.parseDecimalToBigInt('15.5')).toBe(1550n)
      expect(BigIntAdapter.parseDecimalToBigInt('15.51')).toBe(1551n)
      expect(BigIntAdapter.parseDecimalToBigInt('0.99')).toBe(99n)
      expect(BigIntAdapter.parseDecimalToBigInt('1.00')).toBe(100n)
      expect(BigIntAdapter.parseDecimalToBigInt('100.00')).toBe(10000n)
      expect(BigIntAdapter.parseDecimalToBigInt('0.01')).toBe(1n)
      expect(BigIntAdapter.parseDecimalToBigInt('0.00')).toBe(0n)
      expect(BigIntAdapter.parseDecimalToBigInt('123.45')).toBe(12345n)
      expect(BigIntAdapter.parseDecimalToBigInt('1000.00')).toBe(100000n)
    })

    it('should handle comma as decimal separator', () => {
      expect(BigIntAdapter.parseDecimalToBigInt('15,50')).toBe(1550n)
      expect(BigIntAdapter.parseDecimalToBigInt('0,99')).toBe(99n)
      expect(BigIntAdapter.parseDecimalToBigInt('1,00')).toBe(100n)
    })

    it('should handle integers without decimal places', () => {
      expect(BigIntAdapter.parseDecimalToBigInt('15')).toBe(1500n)
      expect(BigIntAdapter.parseDecimalToBigInt('100')).toBe(10000n)
      expect(BigIntAdapter.parseDecimalToBigInt('0')).toBe(0n)
    })

    it('should handle edge cases', () => {
      expect(BigIntAdapter.parseDecimalToBigInt('')).toBeNull()
      expect(BigIntAdapter.parseDecimalToBigInt('   ')).toBeNull()
      // Para entradas inválidas como 'abc', elas se tornam vazias após a limpeza e resultam em 0n
      expect(BigIntAdapter.parseDecimalToBigInt('abc')).toBe(0n)
      expect(BigIntAdapter.parseDecimalToBigInt('12.34.56')).toBeNull() // Mais de um ponto decimal

      // Testar casos onde a conversão resulta em 0
      expect(BigIntAdapter.parseDecimalToBigInt('0')).toBe(0n)
      expect(BigIntAdapter.parseDecimalToBigInt('0.00')).toBe(0n)
      expect(BigIntAdapter.parseDecimalToBigInt('0,00')).toBe(0n)
    })

    it('should remove non-numeric characters except decimal separators', () => {
      expect(BigIntAdapter.parseDecimalToBigInt('R$ 15.50')).toBe(1550n)
      expect(BigIntAdapter.parseDecimalToBigInt('15.50 USD')).toBe(1550n)
      expect(BigIntAdapter.parseDecimalToBigInt('15,50 €')).toBe(1550n)
    })

    it('should handle leading zeros correctly', () => {
      expect(BigIntAdapter.parseDecimalToBigInt('015.50')).toBe(1550n)
      expect(BigIntAdapter.parseDecimalToBigInt('001.00')).toBe(100n)
    })

    it('should handle decimal places longer than 2 digits', () => {
      expect(BigIntAdapter.parseDecimalToBigInt('15.505')).toBe(1550n) // Trunca para 2 casas
      expect(BigIntAdapter.parseDecimalToBigInt('15.509')).toBe(1550n) // Trunca para 2 casas
    })

    it('should handle very large numbers', () => {
      expect(BigIntAdapter.parseDecimalToBigInt('999999.99')).toBe(99999999n)
    })
  })

  describe('serializeBigInt', () => {
    it('should serialize BigInt to string', () => {
      expect(BigIntAdapter.serializeBigInt(1550n)).toBe('1550')
      expect(BigIntAdapter.serializeBigInt(0n)).toBe('0')
      expect(BigIntAdapter.serializeBigInt(1000000n)).toBe('1000000')
    })
  })

  describe('deserializeBigInt', () => {
    it('should deserialize string to BigInt', () => {
      expect(BigIntAdapter.deserializeBigInt('1550')).toBe(1550n)
      expect(BigIntAdapter.deserializeBigInt('0')).toBe(0n)
      expect(BigIntAdapter.deserializeBigInt('1000000')).toBe(1000000n)
    })
  })

  describe('toMinorUnits', () => {
    it('should convert number to minor units (cents)', () => {
      expect(BigIntAdapter.toMinorUnits(15.5)).toBe(1550n)
      expect(BigIntAdapter.toMinorUnits(0.99)).toBe(99n)
      expect(BigIntAdapter.toMinorUnits(100)).toBe(10000n)
      expect(BigIntAdapter.toMinorUnits(0)).toBe(0n)
    })

    it('should convert string to minor units (cents)', () => {
      expect(BigIntAdapter.toMinorUnits('15.50')).toBe(1550n)
      expect(BigIntAdapter.toMinorUnits('0,99')).toBe(99n)
      expect(BigIntAdapter.toMinorUnits('100')).toBe(10000n)
    })

    it('should handle edge cases', () => {
      expect(BigIntAdapter.toMinorUnits(NaN)).toBe(0n)
      expect(BigIntAdapter.toMinorUnits('invalid')).toBe(0n)
    })

    it('should round correctly', () => {
      expect(BigIntAdapter.toMinorUnits(15.555)).toBe(1556n)
      expect(BigIntAdapter.toMinorUnits(15.554)).toBe(1555n)
    })
  })

  describe('fromMinorUnits', () => {
    it('should convert minor units to formatted string', () => {
      expect(BigIntAdapter.fromMinorUnits(1550n)).toBe('15,50')
      expect(BigIntAdapter.fromMinorUnits(99n)).toBe('0,99')
      expect(BigIntAdapter.fromMinorUnits(10000n)).toBe('100,00')
      expect(BigIntAdapter.fromMinorUnits(0n)).toBe('0,00')
    })

    it('should handle large values', () => {
      expect(BigIntAdapter.fromMinorUnits(99999999n)).toBe('999.999,99')
    })
  })
})
