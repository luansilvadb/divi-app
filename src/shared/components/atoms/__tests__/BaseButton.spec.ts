import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  const mountComponent = (props = {}, slots = {}) => {
    return mount(BaseButton, {
      props,
      slots: {
        default: 'Click me',
        ...slots,
      },
      global: {
        plugins: [PrimeVue],
        directives: {
          ripple: Ripple
        }
      }
    })
  }

  it('renders correctly with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Click me')
    // Check if it's using the PrimeVue button internally
    expect(wrapper.find('button.p-button').exists()).toBe(true)
  })

  it('applies the correct severity for "danger" variant', () => {
    const wrapper = mountComponent({ variant: 'danger' })
    expect(wrapper.find('button.p-button-danger').exists()).toBe(true)
  })

  it('applies the correct severity for "secondary" variant', () => {
    const wrapper = mountComponent({ variant: 'secondary' })
    expect(wrapper.find('button.p-button-secondary').exists()).toBe(true)
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mountComponent({ disabled: true })
    const button = wrapper.find('button')
    expect(button.element.disabled).toBe(true)
  })

  it('shows loading state when loading prop is true', () => {
    const wrapper = mountComponent({ loading: true })
    const button = wrapper.find('button')
    // PrimeVue 4 adds p-button-loading class to the button
    expect(button.classes()).toContain('p-button-loading')
    expect(button.element.disabled).toBe(true)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mountComponent()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
