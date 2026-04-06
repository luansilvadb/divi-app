import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GoalsView from '../GoalsView.vue'
import { useGoalStore } from '../../../application/stores/goalStore'

// Mock dependencies
vi.mock('../../../application/stores/goalStore', () => ({
  useGoalStore: vi.fn(),
}))

vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot name="action" /><slot /></div>' },
}))

describe('GoalsView', () => {
  let storeMock: any

  beforeEach(() => {
    setActivePinia(createPinia())
    storeMock = {
      goals: [],
      searchQuery: '',
      isLoading: false,
      totalSaved: 0,
      totalTarget: 0,
      fetchGoals: vi.fn(),
    }
    ;(useGoalStore as any).mockReturnValue(storeMock)
  })

  it('exposes searchEmptySubtitle computed property', () => {
    storeMock.searchQuery = 'Japão'
    
    const wrapper = mount(GoalsView, {
      global: {
        stubs: {
          BaseButton: true,
          BaseCard: true,
          BaseSearchInput: true,
          BaseSummaryItem: true,
          BaseProgressBar: true,
          GoalCard: true,
        },
      },
    })

    // This should fail initially because searchEmptySubtitle is not defined in the component
    expect((wrapper.vm as any).searchEmptySubtitle).toBe('Não encontramos metas para "Japão"')
  })
})
