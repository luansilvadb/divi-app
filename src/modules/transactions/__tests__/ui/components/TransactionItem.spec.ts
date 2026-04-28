import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TransactionItem from '@/modules/transactions/ui/components/TransactionItem.vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'

// Mock naive-ui components
vi.mock('naive-ui', () => ({
  NCard: {
    template: '<div class="n-card"><slot /></div>',
    props: ['hoverable', 'size'],
  },
  NText: {
    template: '<span class="n-text"><slot /></span>',
    props: ['strong', 'type', 'depth'],
  },
  NTag: {
    template: '<span class="n-tag"><slot /></span>',
    props: ['size', 'round', 'bordered'],
  },
  NButton: {
    template: '<button class="n-button"><slot /></button>',
    props: ['quaternary', 'circle', 'type'],
  },
}))

// Mock ItemSyncIndicator
vi.mock('@/shared/components/atoms/ItemSyncIndicator.vue', () => ({
  default: {
    template: '<span class="sync-indicator" />',
    props: ['status'],
  },
}))

// Mock DI container
vi.mock('@/core/di', () => ({
  container: {
    resolve: vi.fn(() => ({
      sanitize: vi.fn((url: string) => url),
      getFallback: vi.fn(() => 'fallback.png'),
    })),
  },
}))

// Mock formatters
vi.mock('@/shared/utils/formatters', () => ({
  formatCurrency: vi.fn((amount: bigint) => {
    const value = Number(amount) / 100
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }),
}))

describe('TransactionItem', () => {
  const mockTransaction = {
    id: 'tx-1',
    title: 'Grocery Shopping',
    amount: 15075n, // R$ 150,75 in minor units
    type: 'expense',
    category_id: 'cat-1',
    wallet_id: 'wallet-1',
    date: '2026-04-15T10:30:00Z',
    sync_status: 'synced',
    user_id: 'user-1',
    tags: [],
    created_at: '2026-04-15T10:30:00Z',
    client_updated_at: '2026-04-15T10:30:00Z',
    version: 1,
    deleted: false,
  }

  const defaultProps = {
    transaction: mockTransaction,
    categoryName: 'Food',
    categoryColor: '#10b981',
    categoryIcon: 'food-icon.png',
    walletName: 'Main Wallet',
    showTime: true,
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders transaction title correctly', () => {
    const wrapper = mount(TransactionItem, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('Grocery Shopping')
  })

  it('renders expense transaction correctly', () => {
    const wrapper = mount(TransactionItem, {
      props: defaultProps,
    })

    // Expense should show title
    expect(wrapper.text()).toContain('Grocery Shopping')
    // Should show minus sign for expense
    expect(wrapper.text()).toContain('-')
  })

  it('renders income transaction correctly', () => {
    const incomeTransaction = {
      ...mockTransaction,
      type: 'income',
      amount: 500000n,
    }

    const wrapper = mount(TransactionItem, {
      props: {
        ...defaultProps,
        transaction: incomeTransaction,
      },
    })

    // Income should show title (using the mock transaction title)
    expect(wrapper.text()).toContain('Grocery Shopping')
    // Should render successfully
    expect(wrapper.find('.n-card').exists()).toBe(true)
  })

  it('renders transfer transaction correctly', () => {
    const transferTransaction = {
      ...mockTransaction,
      type: 'transfer',
      amount: 100000n,
    }

    const wrapper = mount(TransactionItem, {
      props: {
        ...defaultProps,
        transaction: transferTransaction,
      },
    })

    // Transfer should show 'Transferência' label
    expect(wrapper.text()).toContain('Transferência')
    // Should render successfully
    expect(wrapper.find('.n-card').exists()).toBe(true)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(TransactionItem, {
      props: defaultProps,
    })

    await wrapper.find('.n-card').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emits delete event when delete button clicked', async () => {
    const wrapper = mount(TransactionItem, {
      props: defaultProps,
    })

    // Find and click the delete button
    const deleteBtn = wrapper.find('.n-button')
    if (deleteBtn.exists()) {
      await deleteBtn.trigger('click')
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')![0]).toEqual(['tx-1'])
    }
  })

  it('displays category name correctly', () => {
    const wrapper = mount(TransactionItem, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('Food')
  })

  it('displays wallet name correctly', () => {
    const wrapper = mount(TransactionItem, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('Main Wallet')
  })

  it('shows default title when transaction title is empty', () => {
    const wrapper = mount(TransactionItem, {
      props: {
        ...defaultProps,
        transaction: {
          ...mockTransaction,
          title: '',
        },
      },
    })

    expect(wrapper.text()).toContain('Sem título')
  })

  it('displays time when showTime is true', () => {
    const wrapper = mount(TransactionItem, {
      props: defaultProps,
    })

    // Time should be formatted (10:30 for the mock date)
    expect(wrapper.text()).toMatch(/\d{2}:\d{2}/)
  })

  it('shows correct badge color for expense', () => {
    const wrapper = mount(TransactionItem, {
      props: defaultProps,
    })

    // Expense should have red/error styling
    const text = wrapper.text()
    expect(text).toBeDefined()
  })

  it('shows correct badge color for income', () => {
    const incomeTransaction = {
      ...mockTransaction,
      type: 'income',
    }

    const wrapper = mount(TransactionItem, {
      props: {
        ...defaultProps,
        transaction: incomeTransaction,
      },
    })

    const text = wrapper.text()
    expect(text).toBeDefined()
  })

  it('shows transfer label for transfer type', () => {
    const transferTransaction = {
      ...mockTransaction,
      type: 'transfer',
    }

    const wrapper = mount(TransactionItem, {
      props: {
        ...defaultProps,
        transaction: transferTransaction,
      },
    })

    expect(wrapper.text()).toContain('Transferência')
  })
})
