import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SubscriptionsView from '../SubscriptionsView.vue'
import { useSubscriptionStore } from '../../../application/stores/subscriptionStore'

// Mock dependencies
vi.mock('../../../application/stores/subscriptionStore', () => ({
  useSubscriptionStore: vi.fn(),
}))

vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot name="action" /><slot /></div>' },
}))

describe('SubscriptionsView', () => {
  let storeMock: {
    subscriptions: unknown[]
    searchQuery: string
    isLoading: boolean
    totalMonthlyCost: number
    fetchSubscriptions: Mock
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    storeMock = {
      subscriptions: [],
      searchQuery: '',
      isLoading: false,
      totalMonthlyCost: 0,
      fetchSubscriptions: vi.fn(),
    }
    vi.mocked(useSubscriptionStore).mockReturnValue(
      storeMock as unknown as ReturnType<typeof useSubscriptionStore>,
    )
  })

  it('exposes searchEmptySubtitle computed property', () => {
    storeMock.searchQuery = 'Netflix'

    const wrapper = mount(SubscriptionsView, {
      global: {
        stubs: {
          BaseButton: true,
          BaseCard: true,
          BaseSearchInput: true,
          BaseSummaryItem: true,
          BaseIconBox: true,
          BaseProgressBar: true,
        },
      },
    })

    // This should fail initially because searchEmptySubtitle is not defined in the component
    expect((wrapper.vm as unknown as { searchEmptySubtitle: string }).searchEmptySubtitle).toBe(
      'Não encontramos assinaturas para "Netflix"',
    )
  })
})
