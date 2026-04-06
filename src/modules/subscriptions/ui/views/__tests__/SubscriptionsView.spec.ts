import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  let storeMock: Record<string, unknown>

  beforeEach(() => {
    setActivePinia(createPinia())
    storeMock = {
      subscriptions: [],
      searchQuery: '',
      isLoading: false,
      totalMonthlyCost: 0,
      fetchSubscriptions: vi.fn(),
    }
    ;(useSubscriptionStore as unknown as { mockReturnValue: (v: unknown) => void }).mockReturnValue(storeMock)
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
    expect((wrapper.vm as unknown as Record<string, unknown>).searchEmptySubtitle).toBe('Não encontramos assinaturas para "Netflix"')
  })
})
