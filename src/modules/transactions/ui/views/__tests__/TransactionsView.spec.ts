import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TransactionsView from '../TransactionsView.vue'
import { ref, nextTick } from 'vue'
import PrimeVue from 'primevue/config'

// Mock shared components
vi.mock('@/shared/components/organisms/BaseViewHeader.vue', () => ({
  default: { template: '<div><slot name="action" /></div>' },
}))

// Mock StandardPageLayout
vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot name="action" /><slot /></div>' },
}))

// Mock useIsMobile
const isMobileMock = ref(false)
vi.mock('@/shared/composables/useIsMobile', () => ({
  useIsMobile: () => isMobileMock,
}))

// Mock the db file specifically before it gets imported by anything else
vi.mock('@/core/db', () => ({
  db: {
    wallets: { toArray: vi.fn().mockResolvedValue([]), hook: vi.fn() },
    categories: { toArray: vi.fn().mockResolvedValue([]), hook: vi.fn() },
    transactions: {
      toArray: vi.fn().mockResolvedValue([]),
      hook: vi.fn(),
      where: vi.fn().mockReturnValue({
        between: vi.fn().mockReturnValue({
          and: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    },
    payees: { hook: vi.fn() },
    loans: { hook: vi.fn() },
    subscriptions: { hook: vi.fn() }
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
    isMobileMock.value = false
  })

  it('renders correctly on desktop', () => {
    isMobileMock.value = false

    const wrapper = mount(TransactionsView, {
      global: {
        plugins: [PrimeVue],

        stubs: {
          BaseButton: {
            template: '<button><slot /></button>'
          },
          TransactionItem: true,
          BaseCard: true,
          BaseSummaryItem: true,
          BaseProgressBar: true,
          StandardPageLayout: false,

          BaseConfirmDialog: true,
          TransactionModal: true,
          TransactionBottomSheet: true,
          Teleport: true
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    // Desktop: Should have 'Adicionar' button and NO FAB
    expect(wrapper.text()).toContain('Adicionar')
    expect(wrapper.html()).not.toContain('aria-label="Nova Transação"')
  })

  it('renders correctly on mobile', async () => {
    isMobileMock.value = true

    const wrapper = mount(TransactionsView, {
      global: {
        plugins: [PrimeVue],

        stubs: {
          BaseButton: true,
          TransactionItem: true,
          BaseCard: true,
          BaseSummaryItem: true,
          BaseProgressBar: true,
          StandardPageLayout: false,

          BaseConfirmDialog: true,
          TransactionModal: true,
          TransactionBottomSheet: true,
          Teleport: { template: '<div><slot /></div>' }
        },
      },
    })

    await nextTick()

    expect(wrapper.exists()).toBe(true)
    // Mobile: Should have NO 'Adicionar' button
    expect(wrapper.html()).not.toContain('Adicionar')
  })


})

