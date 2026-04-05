import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseBadge from '../BaseBadge.vue'

describe('BaseBadge', () => {
  const mountComponent = (props = {}) => {
    return mount(BaseBadge, {
      props,
      global: {
        plugins: [PrimeVue],
      }
    })
  }

  it('renders correctly with label', () => {
    const wrapper = mountComponent({ label: 'New' })
    expect(wrapper.text()).toContain('New')
    expect(wrapper.find('.p-badge').exists()).toBe(true)
  })

  it('applies success severity when status is success', () => {
    const wrapper = mountComponent({ status: 'success' })
    expect(wrapper.find('.p-badge-success').exists()).toBe(true)
  })

  it('applies danger severity when status is error', () => {
    const wrapper = mountComponent({ status: 'error' })
    expect(wrapper.find('.p-badge-danger').exists()).toBe(true)
  })
})
