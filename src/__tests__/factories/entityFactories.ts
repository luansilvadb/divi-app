import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Budget } from '@/modules/budgets/domain/entities/Budget'
import type { Wallet } from '@/modules/wallets/domain/entities/Wallet'
import { v4 as uuidv4 } from 'uuid'

export const createTestTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: uuidv4(),
  user_id: 'test-user',
  sync_status: 'synced',
  client_updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  version: 1,
  deleted: false,
  title: 'Test Transaction',
  amount: 1000n, // 10.00
  type: 'expense',
  category_id: 'cat-1',
  wallet_id: 'wallet-1',
  date: new Date().toISOString(),
  ...overrides,
})

export const createTestBudget = (overrides: Partial<any> = {}): any => ({
  id: uuidv4(),
  user_id: 'test-user',
  sync_status: 'synced',
  client_updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  version: 1,
  deleted: false,
  category_id: 'cat-1',
  limit_value: 5000n,
  period: 'monthly',
  ...overrides,
})

export const createTestWallet = (overrides: Partial<any> = {}): any => ({
  id: uuidv4(),
  user_id: 'test-user',
  sync_status: 'synced',
  client_updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  version: 1,
  deleted: false,
  name: 'Test Wallet',
  balance: 10000n,
  currency: 'BRL',
  type: 'cash',
  ...overrides,
})
