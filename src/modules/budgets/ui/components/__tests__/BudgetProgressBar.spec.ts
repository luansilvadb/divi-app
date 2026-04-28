import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BudgetProgressBar from '../BudgetProgressBar.vue'
import { createTestingPinia } from '@pinia/testing'

describe('BudgetProgressBar.vue', () => {
  it('should calculate the correct color class based on percentage', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 400,
        limit: 1000,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    // We check for computed percentage
    expect(wrapper.vm.percentage).toBe(40)
  })

  it('should be yellow when spent is 60%', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 600,
        limit: 1000,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.vm.percentage).toBe(60)
  })

  it('should be red when over budget', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 1100,
        limit: 1000,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.vm.clampedPercentage).toBe(100)
    expect(wrapper.vm.percentage).toBe(110)
    expect(wrapper.vm.isOverBudget).toBe(true)
  })
})
