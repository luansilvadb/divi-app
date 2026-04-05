import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseInput from '../BaseInput.vue'

describe('BaseInput', () => {
  const mountComponent = (props = {}) => {
    return mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: '',
        ...props,
      },
      global: {
        plugins: [PrimeVue],
      }
    })
  }

  it('renders correctly with label', () => {
    const wrapper = mountComponent({ label: 'User Name' })
    expect(wrapper.find('label').text()).toBe('User Name')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('emits update:modelValue when text input changes', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('renders InputNumber when type is number', () => {
    const wrapper = mountComponent({ type: 'number', modelValue: 10 })
    // InputNumber component from PrimeVue
    expect(wrapper.find('.p-inputnumber').exists()).toBe(true)
  })

  it('shows error message when error prop is provided', () => {
    const wrapper = mountComponent({ error: 'Required field' })
    expect(wrapper.text()).toContain('Required field')
    expect(wrapper.find('.text-error-main').exists()).toBe(true)
  })

  it('renders with an icon if provided', () => {
    const wrapper = mountComponent({ icon: 'pi pi-user' })
    expect(wrapper.find('.p-iconfield').exists()).toBe(true)
    expect(wrapper.find('.pi-user').exists()).toBe(true)
  })
})
