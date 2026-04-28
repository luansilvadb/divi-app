import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton.vue', () => {
  const global = {
    directives: {
      ripple: () => {},
    },
    components: {
      Button: {
        template: '<button v-bind="$attrs"><slot /></button>',
      },
    },
  }

  it('renders default button correctly', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me',
      },
      global,
    })

    expect(wrapper.text()).toContain('Click me')
  })

  it('applies the correct primary variant by default', () => {
    const wrapper = mount(BaseButton, { global })

    // BaseButton renders as NButton with the apple-button class
    expect(wrapper.classes()).toContain('apple-button')
  })

  it('does not apply shadow-lg when variant is outline', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'outline',
      },
      global,
    })

    expect(wrapper.classes()).not.toContain('shadow-lg')
  })

  it('does not apply shadow-lg when variant is ghost', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'ghost',
      },
      global,
    })

    expect(wrapper.classes()).not.toContain('shadow-lg')
  })

  it('disables the button when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true,
      },
      global,
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('disables the button when loading prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true,
      },
      global,
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
