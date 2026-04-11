import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BudgetsView from '../BudgetsView.vue'
import { useBudgetStore } from '@/modules/budgets/application/stores/budgetStore'

// Mock components
vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot /><slot name="action" /></div>' },
}))
vi.mock('@/shared/components/molecules/BudgetCard.vue', () => ({
  default: { template: '<div class="budget-card-mock"></div>' },
}))
vi.mock('@/shared/components/molecules/BaseSearchInput.vue', () => ({
  default: { template: '<input />' },
}))

describe('BudgetsView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders budgets when they exist', async () => {
    const budgetStore = useBudgetStore()
    budgetStore.budgets = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { id: 'b1', category_id: 'c1', limit_value: 1000, period: 'monthly' } as any,
    ]
    budgetStore.isLoading = false

    const wrapper = mount(BudgetsView, {
      global: {
        stubs: {
          BaseButton: true,
          BaseCard: true,
          BaseSummaryItem: true,
          BudgetDialog: true,
        },
      },
    })

    expect(wrapper.findAll('.budget-card-mock').length).toBe(1)
  })

  it('shows empty state when no budgets', async () => {
    const budgetStore = useBudgetStore()
    budgetStore.budgets = []
    budgetStore.isLoading = false

    const wrapper = mount(BudgetsView, {
      global: {
        stubs: {
          BaseButton: true,
          BaseCard: true,
          BaseSummaryItem: true,
          BudgetDialog: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Nenhum orçamento')
  })
})
