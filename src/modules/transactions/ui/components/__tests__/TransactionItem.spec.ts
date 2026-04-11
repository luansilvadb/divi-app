import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TransactionItem from '../TransactionItem.vue'

// Mock DI container
vi.mock('@/core/di', () => ({
  container: {
    resolve: vi.fn((_token) => {
      // Return a mock for AssetLoader
      return {
        sanitize: (icon: string) => icon,
        getFallback: () => 'fallback.png',
      }
    }),
  },
}))

describe('TransactionItem.vue', () => {
  const transaction = {
    id: '1',
    title: 'Test Transaction',
    amount: 100,
    type: 'expense' as const,
    date: new Date().toISOString(),
    category_id: 'cat1',
    wallet_id: 'wal1',
    user_id: 'user1',
    sync_status: 'synced' as const,
    deleted: false,
    client_updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    version: 1,
  }

  const props = {
    transaction,
    categoryName: 'Food',
    categoryColor: '#ff0000',
  }

  it('renders sync pending indicator when syncStatus is pending', () => {
    const pendingTransaction = { ...transaction, sync_status: 'pending' as const }
    const wrapper = mount(TransactionItem, {
      props: { ...props, transaction: pendingTransaction },
    })

    // This expectation should fail because we haven't implemented the indicator yet
    expect(wrapper.find('[data-test="sync-indicator-pending"]').exists()).toBe(true)
  })

  it('renders sync failed indicator when syncStatus is failed', () => {
    const failedTransaction = { ...transaction, sync_status: 'failed' as const }
    const wrapper = mount(TransactionItem, {
      props: { ...props, transaction: failedTransaction },
    })

    // This expectation should fail because we haven't implemented the indicator yet
    expect(wrapper.find('[data-test="sync-indicator-failed"]').exists()).toBe(true)
  })

  it('does not render sync indicator when syncStatus is synced', () => {
    const wrapper = mount(TransactionItem, {
      props: { ...props },
    })

    expect(wrapper.find('[data-test^="sync-indicator-"]').exists()).toBe(false)
  })
})
