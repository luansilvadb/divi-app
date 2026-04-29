import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChartTheme } from './useChartTheme'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Mocking document.documentElement classList
const mockContains = vi.fn();
document.documentElement.classList.contains = mockContains;

// Mock getComputedStyle
window.getComputedStyle = vi.fn().mockReturnValue({
  getPropertyValue: vi.fn().mockReturnValue(''),
}) as any;

const TestComponent = defineComponent({
  setup() {
    return useChartTheme()
  },
  template: '<div></div>',
})

describe('useChartTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('detects light theme by default', () => {
    mockContains.mockReturnValue(false)
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.colors.isDark).toBe(false)
    expect(wrapper.vm.colors.tooltipBg).toContain('255, 255, 255')
  })

  it('detects dark theme', () => {
    mockContains.mockReturnValue(true)
    const wrapper = mount(TestComponent)
    // Manually trigger update if needed, or just check if it was called on mount
    expect(wrapper.vm.colors.isDark).toBe(true)
    expect(wrapper.vm.colors.tooltipBg).toContain('44, 44, 46')
  })

  it('converts hex to rgba correctly', () => {
    const wrapper = mount(TestComponent)
    const rgba = wrapper.vm.hexToRgba('#ff0000', 0.5)
    expect(rgba).toBe('rgba(255, 0, 0, 0.5)')
  })
})
