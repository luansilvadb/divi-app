/** Number of cents per monetary unit (e.g., 100 cents = R$ 1,00) */
const CENTS_PER_UNIT = 100

export class BigIntAdapter {
  private static normalizeInput(decimalString: string): string | null {
    if (!decimalString || decimalString.trim() === '') {
      return null
    }

    const cleaned = decimalString.trim().replace(/[^0-9.,]/g, '')
    const normalized = cleaned.replace(',', '.')

    if ((normalized.match(/\./g) || []).length > 1) {
      return null
    }

    return normalized
  }

  private static parseParts(normalized: string): { integerPart: string; decimalPart: string } {
    const parts = normalized.split('.')
    let integerPart = '0'
    let decimalPart = '00'

    if (parts.length >= 1 && parts[0]) {
      integerPart = parts[0] || '0'
    }

    if (parts.length >= 2 && parts[1]) {
      decimalPart = parts[1].padEnd(2, '0').substring(0, 2)
    }

    integerPart = integerPart.replace(/^0+(?=\d)/, '') || '0'

    return { integerPart, decimalPart }
  }

  // Método para converter decimal string para BigInt (em centavos)
  static parseDecimalToBigInt(decimalString: string): bigint | null {
    const normalized = this.normalizeInput(decimalString)
    if (!normalized) return null

    const { integerPart, decimalPart } = this.parseParts(normalized)

    try {
      return BigInt(integerPart + decimalPart)
    } catch {
      return null
    }
  }

  // Método para serializar BigInt para JSON
  static serializeBigInt(value: bigint): string {
    return value.toString();
  }

  // Método para desserializar BigInt de JSON
  static deserializeBigInt(value: string): bigint {
    return BigInt(value);
  }

  /**
   * Converte valor amigável (decimal como número ou string) para BigInt (centavos / minor units)
   */
  static toMinorUnits(value: number | string): bigint {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
    if (isNaN(num)) return 0n
    return BigInt(Math.round(num * CENTS_PER_UNIT))
  }

  /**
   * Converte BigInt (centavos) para string decimal amigável
   */
  static fromMinorUnits(value: bigint): string {
    const num = Number(value) / CENTS_PER_UNIT
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  /**
   * Soma um array de valores BigInt e retorna como número decimal
   * @param values Array de valores BigInt
   * @param selector Função opcional para extrair o valor do item
   * @returns Soma convertida para número decimal
   */
  static sumToNumber<T>(items: T[], selector: (item: T) => bigint | string): number {
    const sum = items.reduce((acc, item) => {
      const value = selector(item)
      return acc + BigInt(value)
    }, 0n)
    return Number(sum) / CENTS_PER_UNIT
  }
}
