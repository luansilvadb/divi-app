import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BudgetProgressBar from '../BudgetProgressBar.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'

describe('BudgetProgressBar.vue', () => {
  it('should calculate the correct color class based on percentage', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 400,
        limit: 1000
      }
    })

    // 40% spent
    const baseProgress = wrapper.findComponent(BaseProgressBar)
    expect(baseProgress.props('percentage')).toBe(40)
    expect(baseProgress.props('status')).toBe('success')
  })

  it('should be yellow when spent is 60%', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 600,
        limit: 1000
      }
    })
    // 60% spent
    const baseProgress = wrapper.findComponent(BaseProgressBar)
    expect(baseProgress.props('percentage')).toBe(60)
    expect(baseProgress.props('status')).toBe('warning')
  })

  it('should be red when over budget', () => {
    const wrapper = mount(BudgetProgressBar, {
      props: {
        spent: 1100,
        limit: 1000
      }
    })
    // Over budget
    const baseProgress = wrapper.findComponent(BaseProgressBar)
    expect(baseProgress.props('percentage')).toBe(100)
    expect(baseProgress.props('status')).toBe('error')
  })
})
