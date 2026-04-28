import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '../BaseSelect.vue'

describe('BaseSelect.vue', () => {

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
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Label')
    expect(label.attributes('for')).toBe('test-select')
  })

  it('renders select component with options', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-select',
        modelValue: null,
        options: defaultOptions,
      },
    })

    // Verify the component renders
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.mb-2').exists()).toBe(true)
  })

  it('renders error message if error prop is provided', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'test-error',
        modelValue: null,
        options: defaultOptions,
        error: 'This is an error message',
      },
    })

    const errorMsg = wrapper.find('#test-error-error')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toBe('This is an error message')
  })
})
