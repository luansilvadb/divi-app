import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PatrimonialChart from '../PatrimonialChart.vue'
import { createTestingPinia } from '@pinia/testing'
import { useThemeStore } from '../../../stores/themeStore'

vi.mock('primevue/chart', () => ({
  default: {
    name: 'Chart',
    props: ['type', 'data', 'options'],
    template: '<div class="chart-mock" :data-options="JSON.stringify(options)"></div>',
  },
}))

describe('PatrimonialChart.vue', () => {
  const props = {
    data: [10, 20, 30],
    labels: ['A', 'B', 'C'],
  }

  const global = {
    plugins: [createTestingPinia({ createSpy: vi.fn })],
  }

  let themeStore: any

  beforeEach(() => {
    themeStore = useThemeStore()
    // Default is light mode
    themeStore.isDark = false
  })

  it('reacts to theme changes for chart colors (Expected to FAIL)', async () => {
    const wrapper = mount(PatrimonialChart, {
      props,
      global,
    })

    const chartMock = wrapper.find('.chart-mock')
    let options = JSON.parse(chartMock.attributes('data-options'))

    // Expecting light mode colors (e.g., surface-600)
    // Now it should be #475569
    expect(options.scales.y.ticks.color).toBe('#475569')

    // Change to dark mode
    themeStore.isDark = true
    await wrapper.vm.$nextTick()

    options = JSON.parse(wrapper.find('.chart-mock').attributes('data-options'))
    expect(options.scales.y.ticks.color).toBe('#94a3b8')
  })
})
