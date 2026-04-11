import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../atoms/BaseButton.vue'

describe('Apple Style Buttons', () => {
  it('primary variant should use apple-material classes if applicable or correct primary bg', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'primary' },
      slots: { default: 'Click me' },
    })

    const button = wrapper.find('button')
    // Primary apple button should not have the hardcoded surface-700 anymore
    expect(button.attributes('class')).not.toContain('!bg-surface-700')
  })

  it('secondary variant should be tinted', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'secondary' },
      slots: { default: 'Secondary' },
    })

    // We'll check for a new class like 'apple-button-tinted' or specific background logic
    expect(wrapper.classes()).toContain('apple-button-tinted')
  })
})
