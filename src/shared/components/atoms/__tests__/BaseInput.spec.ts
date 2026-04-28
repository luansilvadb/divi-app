import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../BaseInput.vue'

describe('BaseInput.vue', () => {
  it('renders a label if provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Label')
    expect(label.attributes('for')).toBe('test-input')
  })

  it('does not render a label if not provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
      },
    })

    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('emits update:modelValue on text input', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        type: 'text',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('new text')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new text'])
  })

  it('emits update:modelValue on number input', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-number',
        modelValue: null,
        type: 'number',
      },
    })

    // Number input renders as input element via NInputNumber stub
    const input = wrapper.find('input')
    await input.setValue('42')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // NInputNumber stub converts to Number
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
  })

  it('renders error message if error prop is provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-error',
        modelValue: '',
        error: 'This is an error message',
      },
    })

    const errorMsg = wrapper.find('#test-error-error')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toBe('This is an error message')
  })
})
