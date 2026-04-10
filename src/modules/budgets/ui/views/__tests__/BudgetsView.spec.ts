import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BudgetsView from '../BudgetsView.vue'
import { useBudgetStore } from '../../../application/stores/budgetStore'

// Mock dependencies
vi.mock('../../../application/stores/budgetStore', () => ({
  useBudgetStore: vi.fn(),
}))

vi.mock('@/modules/transactions/application/stores/transactionStore', () => ({
  useTransactionStore: () => ({
    transactions: [],
    fetchTransactionsByMonth: vi.fn(),
  }),
}))

vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot name="action" /><slot /></div>' },
}))

describe('BudgetsView', () => {
  let storeMock: {
    budgets: unknown[]
    searchQuery: string
    isLoading: boolean
    totalBudgeted: number
    totalConsumed: number
    getConsumed: Mock
    fetchBudgets: Mock
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    storeMock = {
      budgets: [],
      searchQuery: '',
      isLoading: false,
      totalBudgeted: 0,
      totalConsumed: 0,
      getConsumed: vi.fn().mockReturnValue(0),
      fetchBudgets: vi.fn(),
    }
    vi.mocked(useBudgetStore).mockReturnValue(storeMock as unknown as ReturnType<typeof useBudgetStore>)
  })

  it('exposes searchEmptySubtitle computed property', () => {
    storeMock.searchQuery = 'Viagem'
    
    const wrapper = mount(BudgetsView, {
      global: {
        stubs: {
          BaseButton: true,
          BaseCard: true,
          BaseSearchInput: true,
          BaseSummaryItem: true,
          BudgetCard: true,
        },
      },
    })

    // This should fail initially because searchEmptySubtitle is not defined in the component
    expect((wrapper.vm as unknown as { searchEmptySubtitle: string }).searchEmptySubtitle).toBe('Não encontramos orçamentos para "Viagem"')
  })
})

