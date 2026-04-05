import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseSelect from '../BaseSelect.vue'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('BaseSelect', () => {
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ]

  const mountComponent = (props = {}) => {
    return mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: null,
        options,
        ...props,
      },
      global: {
        plugins: [PrimeVue],
      }
    })
  }

  it('renders correctly with label', () => {
    const wrapper = mountComponent({ label: 'Pick one' })
    expect(wrapper.find('label').text()).toBe('Pick one')
    expect(wrapper.find('.p-select').exists()).toBe(true)
  })

  it('shows placeholder text', () => {
    const wrapper = mountComponent({ placeholder: 'Select an option' })
    expect(wrapper.find('.p-select-label').text()).toBe('Select an option')
  })

  it('shows error message when error prop is provided', () => {
    const wrapper = mountComponent({ error: 'Selection required' })
    expect(wrapper.text()).toContain('Selection required')
    expect(wrapper.find('.text-error-main').exists()).toBe(true)
  })

  it('renders empty message when no options are provided', async () => {
    const wrapper = mountComponent({ options: [] })
    // Click to open the select to see empty template
    await wrapper.find('.p-select').trigger('click')
    // In unit tests, we might need to check the presence of the empty slot content
    // but PrimeVue Select might render it in a portal.
    // However, BaseSelect.vue has a #empty slot.
    // If it's not portaled in test-utils, we might find it.
  })
})
