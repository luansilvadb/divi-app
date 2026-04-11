import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BudgetCard from '../BudgetCard.vue'
import type { Budget } from '@/shared/domain/entities/Budget'

// Mock components
vi.mock('@/shared/components/atoms/ItemSyncIndicator.vue', () => ({
  default: { template: '<div></div>' },
}))

describe('BudgetCard.vue', () => {
  const budget = {
    id: 'b1',
    category_id: 'c1',
    limit_value: 1000,
    period: 'monthly',
    name: 'Test Budget',
    sync_status: 'synced',
  } as unknown as Budget

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders budget information correctly', () => {
    const wrapper = mount(BudgetCard, {
      props: {
        budget,
        consumed: 400,
      },
      global: {
        stubs: {
          BaseCard: { template: '<div><slot name="header" /><slot /></div>' },
          BaseBadge: true,
          BaseIconBox: true,
          BudgetProgressBar: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Test Budget')
    expect(wrapper.text()).toContain('400')
    expect(wrapper.text()).toContain('1.000')
    expect(wrapper.text()).toContain('40%')
  })

  it('shows over budget alert when consumed > limit', () => {
    const wrapper = mount(BudgetCard, {
      props: {
        budget,
        consumed: 1200,
      },
      global: {
        stubs: {
          BaseCard: { template: '<div><slot name="header" /><slot /></div>' },
          BaseBadge: true,
          BaseIconBox: true,
          BudgetProgressBar: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Orçamento estourado')
  })
})
