import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BudgetProgressBar from '../BudgetProgressBar.vue'

describe('BudgetProgressBar.vue', () => {
  it('should calculate the correct color class based on percentage', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 400,
        limit: 1000
      }
    })

    // 40% spent
    expect(wrapper.vm.percentage).toBe(40)
    expect(wrapper.vm.status).toBe('success') // Green if < 60%? Let's check spec again.
  })

  it('should be yellow when spent is 60%', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 600,
        limit: 1000
      }
    })
    // 60% spent
    expect(wrapper.vm.percentage).toBe(60)
    expect(wrapper.vm.status).toBe('warning')
  })

  it('should be red when over budget', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 1100,
        limit: 1000
      }
    })
    // Over budget
    expect(wrapper.vm.clampedPercentage).toBe(100)
    expect(wrapper.vm.status).toBe('error')
  })
})
