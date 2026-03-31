import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TransactionsView from '../TransactionsView.vue'

// Mock shared components
vi.mock('@/shared/components/organisms/BaseViewHeader.vue', () => ({
  default: { template: '<div><slot name="action" /></div>' },
}))

// Mock StandardPageLayout
vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot name="action" /><slot /></div>' },
}))

// Mock the db file specifically before it gets imported by anything else
vi.mock('@/core/db', () => ({
  db: {
    wallets: { toArray: vi.fn().mockResolvedValue([]) },
    categories: { toArray: vi.fn().mockResolvedValue([]) },
    transactions: {
      toArray: vi.fn().mockResolvedValue([]),
      where: vi.fn().mockReturnValue({
        between: vi.fn().mockReturnValue({
          and: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    },
  },
}))

// Mock transaction store to avoid IndexedDB calls
vi.mock('../../application/stores/transactionStore', () => ({
  useTransactionStore: () => ({
    transactions: [],
    wallets: [],
    categories: [],
    isLoading: false,
    searchQuery: '',
    categoryMap: {},
    walletMap: {},
    totalIncome: 0,
    totalExpense: 0,
    monthlyBalance: 0,
    topCategories: [],
    groupedTransactions: {},
    fetchWallets: vi.fn().mockResolvedValue(undefined),
    fetchCategories: vi.fn().mockResolvedValue(undefined),
    fetchTransactionsByMonth: vi.fn().mockResolvedValue(undefined),
  }),
}))

describe('TransactionsView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly', () => {
    const wrapper = mount(TransactionsView, {
      global: {
        stubs: {
          BaseButton: true,
          TransactionItem: true,
          TransactionForm: true,
          BaseCard: true,
          BaseSummaryItem: true,
          BaseProgressBar: true,
          StandardPageLayout: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
