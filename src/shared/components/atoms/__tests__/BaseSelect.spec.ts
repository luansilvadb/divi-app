import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '../BaseSelect.vue'

describe('BaseSelect.vue', () => {
  const global = {
    stubs: {
      NSelect: {
        name: 'NSelect',
        props: ['value', 'options'],
        template: '<div class="n-select-stub"><slot /></div>',
      },
    },
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

    const select = wrapper.findComponent({ name: 'NSelect' })
    await select.vm.$emit('update:value', 2)

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
