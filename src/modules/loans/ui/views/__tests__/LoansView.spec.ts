import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoansView from '../LoansView.vue'
import { useLoanStore } from '../../../application/stores/loanStore'

// Mock dependencies
vi.mock('../../../application/stores/loanStore', () => ({
  useLoanStore: vi.fn(),
}))

vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot name="action" /><slot /></div>' },
}))

describe('LoansView', () => {
  let storeMock: {
    loans: unknown[]
    searchQuery: string
    isLoading: boolean
    totalDebt: number
    fetchLoans: Mock
    deleteLoan: Mock
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    storeMock = {
      loans: [],
      searchQuery: '',
      isLoading: false,
      totalDebt: 0,
      fetchLoans: vi.fn(),
      deleteLoan: vi.fn(),
    }
    vi.mocked(useLoanStore).mockReturnValue(storeMock as unknown as ReturnType<typeof useLoanStore>)
  })

  it('exposes searchEmptySubtitle computed property', () => {
    storeMock.searchQuery = 'Casa'
    
    const wrapper = mount(LoansView, {
      global: {
        stubs: {
          BaseButton: true,
          BaseCard: true,
          BaseSearchInput: true,
          BaseSummaryItem: true,
          LoanCard: true,
          BaseConfirmDialog: true,
          Teleport: true,
        },
      },
    })

    // This should fail initially because searchEmptySubtitle is not defined in the component
    expect((wrapper.vm as unknown as { searchEmptySubtitle: string }).searchEmptySubtitle).toBe('Não encontramos empréstimos para "Casa"')
  })
})

