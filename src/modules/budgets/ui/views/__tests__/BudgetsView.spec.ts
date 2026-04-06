import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  let storeMock: any

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
    ;(useBudgetStore as any).mockReturnValue(storeMock)
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
    expect((wrapper.vm as any).searchEmptySubtitle).toBe('Não encontramos orçamentos para "Viagem"')
  })
})
