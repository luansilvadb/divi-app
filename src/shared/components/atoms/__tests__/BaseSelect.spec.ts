import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseSelect from '../BaseSelect.vue'

// Mock matchMedia for PrimeVue Select component
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('BaseSelect.vue', () => {
  const global = {
    plugins: [PrimeVue],
  }

  const defaultOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ]

  it('renders a label if provided', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        label: 'Test Label',
        modelValue: null,
        options: defaultOptions,
      },
      global,
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Label')
    expect(label.attributes('for')).toBe('test-select')
  })

  it('emits update:modelValue when an option is selected', async () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: null,
        options: defaultOptions,
      },
      global,
    })

    const select = wrapper.findComponent({ name: 'Select' })
    await select.vm.$emit('update:modelValue', 2)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('renders error message if error prop is provided', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-error',
        modelValue: null,
        options: defaultOptions,
        error: 'This is an error message',
      },
      global,
    })

    const errorMsg = wrapper.find('#test-error-error')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toBe('This is an error message')
  })
})

