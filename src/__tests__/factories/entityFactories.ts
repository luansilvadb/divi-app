import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'
import type { IBudget } from '@/modules/budgets/domain/entities/IBudget'
import type { IWallet } from '@/modules/wallets/domain/entities/IWallet'
import { v4 as uuidv4 } from 'uuid'

export const createTestITransaction = (overrides: Partial<ITransaction> = {}): ITransaction => ({
  id: uuidv4(),
  user_id: 'test-user',
  sync_status: 'synced',
  client_updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  version: 1,
  deleted: false,
  title: 'Test ITransaction',
  amount: 1000n, // 10.00
  type: 'expense',
  category_id: 'cat-1',
  wallet_id: 'IWallet-1',
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

export const createTestIWallet = (overrides: Partial<any> = {}): any => ({
  id: uuidv4(),
  user_id: 'test-user',
  sync_status: 'synced',
  client_updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  version: 1,
  deleted: false,
  name: 'Test IWallet',
  balance: 10000n,
  currency: 'BRL',
  type: 'cash',
  ...overrides,
})
