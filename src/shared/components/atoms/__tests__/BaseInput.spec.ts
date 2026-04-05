import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseInput from '../BaseInput.vue'

describe('BaseInput.vue', () => {
  const global = {
    plugins: [PrimeVue],
    stubs: {
      IconField: true,
      InputIcon: true,
    }
  }

  it('renders a label if provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
      global,
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
      global,
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
      global,
    })

    const input = wrapper.find('input[type="text"]')
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
      global,
    })

    const input = wrapper.findComponent({ name: 'InputNumber' })
    await input.vm.$emit('update:modelValue', 42)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
  })

  it('renders error message if error prop is provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-error',
        modelValue: '',
        error: 'This is an error message',
      },
      global,
    })

    const errorMsg = wrapper.find('#test-error-error')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toBe('This is an error message')
  })
})
