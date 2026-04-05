import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseCard from '../BaseCard.vue'

describe('BaseCard', () => {
  const mountComponent = (props = {}, slots = {}) => {
    return mount(BaseCard, {
      props,
      slots: {
        default: '<div id="main-content">Content</div>',
        ...slots,
      },
      global: {
        plugins: [PrimeVue],
      }
    })
  }

  it('renders correctly with default content', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('#main-content').exists()).toBe(true)
    expect(wrapper.find('.p-card').exists()).toBe(true)
  })

  it('renders header and footer slots when provided', () => {
    const wrapper = mountComponent({}, {
      header: '<span id="header-slot">Header</span>',
      footer: '<span id="footer-slot">Footer</span>',
    })
    expect(wrapper.find('#header-slot').exists()).toBe(true)
    expect(wrapper.find('#footer-slot').exists()).toBe(true)
  })

  it('shows loading state with skeleton', () => {
    const wrapper = mountComponent({ isLoading: true })
    expect(wrapper.find('.p-skeleton').exists()).toBe(true)
    expect(wrapper.find('#main-content').exists()).toBe(false)
  })

  it('shows error state when error prop is true', () => {
    const wrapper = mountComponent({ error: true, errorMsg: 'Custom Error' })
    expect(wrapper.text()).toContain('Custom Error')
    expect(wrapper.find('.pi-exclamation-circle').exists()).toBe(true)
  })

  it('shows empty state when isEmpty prop is true', () => {
    const wrapper = mountComponent({ isEmpty: true, emptyTitle: 'Nothing Here' })
    expect(wrapper.text()).toContain('Nothing Here')
  })

  it('emits click event when clickable prop is true', async () => {
    const wrapper = mountComponent({ clickable: true })
    await wrapper.find('.p-card').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
