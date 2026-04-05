import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseIconBox from '../BaseIconBox.vue'

describe('BaseIconBox', () => {
  const mountComponent = (props = {}, slots = {}) => {
    return mount(BaseIconBox, {
      props,
      slots: {
        default: '<i class="pi pi-user"></i>',
        ...slots,
      },
      global: {
        plugins: [PrimeVue],
      }
    })
  }

  it('renders correctly with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.pi-user').exists()).toBe(true)
    expect(wrapper.find('.w-10.h-10').exists()).toBe(true)
  })

  it('applies correct size for "lg" size', () => {
    const wrapper = mountComponent({ size: 'lg' })
    expect(wrapper.find('.w-12.h-12').exists()).toBe(true)
  })

  it('applies custom color styles', () => {
    const wrapper = mountComponent({ color: '#ff0000' })
    const style = wrapper.attributes('style')
    expect(style).toContain('color: rgb(255, 0, 0)')
    expect(style).toContain('background-color: rgba(255, 0, 0, 0.082)') // #ff000015 is approx 0.082 opacity
  })

  it('applies default primary classes when no color is provided', () => {
    const wrapper = mountComponent()
    expect(wrapper.classes()).toContain('bg-primary-main/10')
    expect(wrapper.classes()).toContain('text-primary-main')
  })
})
