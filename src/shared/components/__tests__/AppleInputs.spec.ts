import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../atoms/BaseInput.vue'

describe('BaseInput Styles', () => {
  it('should render correct components from Naive UI', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
      },
    })

    // NInput is rendered
    expect(wrapper.findComponent({ name: 'NInput' }).exists()).toBe(true)
  })
})
