import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseProgressBar from '../BaseProgressBar.vue'

describe('BaseProgressBar', () => {
  const mountComponent = (props = {}) => {
    return mount(BaseProgressBar, {
      props: {
        percentage: 50,
        ...props,
      },
      global: {
        plugins: [PrimeVue],
      }
    })
  }

  it('renders correctly with percentage', () => {
    const wrapper = mountComponent({ percentage: 75 })
    // In PrimeVue 4, check if progressbar exists and has correct value
    const progressBar = wrapper.find('.p-progressbar')
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.attributes('aria-valuenow')).toBe('75')
  })

  it('renders even with 0 percent', () => {
    const wrapper = mountComponent({ percentage: 0 })
    const progressBar = wrapper.find('.p-progressbar')
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.attributes('aria-valuenow')).toBe('0')
  })
})
