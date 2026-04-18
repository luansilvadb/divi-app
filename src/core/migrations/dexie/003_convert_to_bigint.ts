import type { DexieMigration } from '../types'

/**
 * Migration 003 - Convert to BigInt
 * 
 * Converte todos os campos financeiros de 'number' para 'bigint' nativo
 * para garantir precisão absoluta (Elite Precision).
 */
export const migration003ConvertToBigInt: DexieMigration = {
  version: 3,
  name: 'convert_to_bigint',
  description: 'Converte campos monetários para BigInt para suporte a minor-units com precisão total.',
  createdAt: '2026-04-12T23:30:00Z',
  stores: {}, // Mantém os mesmos índices
  upgrade: async (trans) => {
    // 1. Transactions: amount
    await trans.table('transactions').toCollection().modify((item) => {
      if (typeof item.amount === 'number') {
        item.amount = BigInt(Math.round(item.amount))
      }
    })

    // 2. Wallets: balance
    await trans.table('wallets').toCollection().modify((item) => {
      if (typeof item.balance === 'number') {
        item.balance = BigInt(Math.round(item.balance))
      }
    })

    // 3. Budgets: limit_value
    await trans.table('budgets').toCollection().modify((item) => {
      if (typeof item.limit_value === 'number') {
        item.limit_value = BigInt(Math.round(item.limit_value))
      }
    })

    // 4. Goals: target_value, current_value
    await trans.table('goals').toCollection().modify((item) => {
      if (typeof item.target_value === 'number') {
        item.target_value = BigInt(Math.round(item.target_value))
      }
      if (typeof item.current_value === 'number') {
        item.current_value = BigInt(Math.round(item.current_value))
      }
    })

    // 5. Loans: total_value, remaining_value
    await trans.table('loans').toCollection().modify((item) => {
      if (typeof item.total_value === 'number') {
        item.total_value = BigInt(Math.round(item.total_value))
      }
      if (typeof item.remaining_value === 'number') {
        item.remaining_value = BigInt(Math.round(item.remaining_value))
      }
    })

    // 6. Subscriptions: amount
    await trans.table('subscriptions').toCollection().modify((item) => {
      if (typeof item.amount === 'number') {
        item.amount = BigInt(Math.round(item.amount))
      }
    })
  }
}
