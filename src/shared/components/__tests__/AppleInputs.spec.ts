import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../atoms/BaseInput.vue'
import PrimeVue from 'primevue/config'

describe('Apple Style Inputs', () => {
  it('should use updated background and radius for Apple style', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
      global: {
        plugins: [PrimeVue],
      },
    })

    const input = wrapper.find('input')
    // We expect a class that indicates apple styling or specific property changes
    // For now, let's look for a class we will add
    expect(input.attributes('class')).toContain('apple-input')
  })
})
