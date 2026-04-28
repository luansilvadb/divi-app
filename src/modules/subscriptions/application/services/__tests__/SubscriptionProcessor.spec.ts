import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubscriptionProcessor } from '../SubscriptionProcessor'
import { db } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

// Mock dependencies
vi.mock('@/infrastructure/storage/VaultDatabase', () => ({
  db: {
    subscriptions: {
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
      and: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue(1),
    },
    transactions: {
      add: vi.fn().mockResolvedValue('tx-1'),
    },
  },
}))

vi.mock('@/core/sync/SyncEngine', () => ({
  SyncEngine: {
    getInstance: vi.fn().mockReturnValue({
      enqueueSync: vi.fn(),
    }),
  },
}))

describe('SubscriptionProcessor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should process pending subscriptions', async () => {
    const mockDate = new Date('2026-04-15')
    vi.setSystemTime(mockDate)

    const mockSubscription = {
      id: 'sub-1',
      user_id: 'user-1',
      name: 'Netflix',
      amount: 5000n,
      billing_day: 10,
      category_id: 'cat-1',
      wallet_id: 'wallet-1',
      last_billed_at: null,
      deleted: false,
    }

    ;(db.subscriptions.where as any).mockReturnThis()
    ;(db.subscriptions as any).equals.mockReturnThis()
    ;(db.subscriptions as any).and.mockReturnThis()
    vi.mocked(db.subscriptions.toArray).mockResolvedValue([mockSubscription])

    await SubscriptionProcessor.processPendingSubscriptions('user-1')

    expect(db.transactions.add).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        title: 'Assinatura: Netflix',
        type: 'expense',
      }),
    )
    expect(db.subscriptions.update).toHaveBeenCalledWith('sub-1', expect.any(Object))
    expect(SyncEngine.getInstance().enqueueSync).toHaveBeenCalled()

    vi.useRealTimers()
  })

  it('should not bill if already billed this month', async () => {
    const mockDate = new Date('2026-04-15')
    vi.setSystemTime(mockDate)

    const mockSubscription = {
      id: 'sub-1',
      user_id: 'user-1',
      name: 'Netflix',
      amount: 5000n,
      billing_day: 10,
      category_id: 'cat-1',
      wallet_id: 'wallet-1',
      last_billed_at: mockDate.toISOString(), // Already billed today
      deleted: false,
    }

    vi.mocked(db.subscriptions.toArray).mockResolvedValue([mockSubscription])

    await SubscriptionProcessor.processPendingSubscriptions('user-1')

    expect(db.transactions.add).not.toHaveBeenCalled()
    expect(SyncEngine.getInstance().enqueueSync).not.toHaveBeenCalled()

    vi.useRealTimers()
  })

  it('should handle empty subscriptions', async () => {
    vi.mocked(db.subscriptions.toArray).mockResolvedValue([])

    await SubscriptionProcessor.processPendingSubscriptions('user-1')

    expect(db.transactions.add).not.toHaveBeenCalled()
    expect(SyncEngine.getInstance().enqueueSync).not.toHaveBeenCalled()
  })

  it('should handle errors gracefully', async () => {
    vi.mocked(db.subscriptions.where).mockImplementation(() => {
      throw new Error('Database error')
    })

    // Should not throw
    await expect(SubscriptionProcessor.processPendingSubscriptions('user-1')).resolves.not.toThrow()
  })
})
