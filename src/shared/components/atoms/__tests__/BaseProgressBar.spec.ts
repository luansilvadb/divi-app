import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseProgressBar from '../BaseProgressBar.vue'

// Mock useTheme
vi.mock('@/core/theme', () => ({
  useTheme: () => ({
    isDark: { value: false }
  })
}))

describe('BaseProgressBar.vue', () => {
  it('renders progress bar with correct value', () => {
    const wrapper = mount(BaseProgressBar, {
      props: {
        percentage: 75,
      },
    })

    const nProgress = wrapper.findComponent({ name: 'NProgress' })
    expect(nProgress.exists()).toBe(true)
    expect(nProgress.props('percentage')).toBe(75)
  })
})
