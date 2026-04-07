import { describe, it, expect } from 'vitest'
import { createTransaction } from '../Transaction'

describe('Transaction Domain Model', () => {
  it('should create a valid transaction object', () => {
    const transactionData = {
      id: '018ebb00-0000-7000-8000-000000000001',
      user_id: 'user-1',
      title: 'Lunch',
      amount: 15.5,
      type: 'expense' as const,
      category_id: 'cat-1',
      wallet_id: 'wallet-1',
      date: '2026-04-07T12:00:00Z',
      deleted: false,
      created_at: '2026-04-07T12:00:00Z',
      updated_at: '2026-04-07T12:00:00Z'
    }

    const transaction = createTransaction(transactionData)

    expect(transaction).toEqual(transactionData)
  })

  it('should throw error if amount is negative', () => {
    const transactionData = {
      id: '018ebb00-0000-7000-8000-000000000001',
      user_id: 'user-1',
      title: 'Lunch',
      amount: -15.5,
      type: 'expense' as const,
      category_id: 'cat-1',
      wallet_id: 'wallet-1',
      date: '2026-04-07T12:00:00Z',
      deleted: false,
      created_at: '2026-04-07T12:00:00Z',
      updated_at: '2026-04-07T12:00:00Z'
    }

    expect(() => createTransaction(transactionData)).toThrow('Amount must be positive')
  })
})
