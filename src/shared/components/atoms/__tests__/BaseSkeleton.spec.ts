import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseSkeleton from '../BaseSkeleton.vue'

describe('BaseSkeleton', () => {
  const mountComponent = (props = {}) => {
    return mount(BaseSkeleton, {
      props,
      global: {
        plugins: [PrimeVue],
      }
    })
  }

  it('renders correctly with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.p-skeleton').exists()).toBe(true)
  })

  it('applies correct dimensions', () => {
    const wrapper = mountComponent({ width: '200px', height: '50px' })
    const skeleton = wrapper.find('.p-skeleton')
    expect(skeleton.attributes('style')).toContain('width: 200px')
    expect(skeleton.attributes('style')).toContain('height: 50px')
  })

  it('applies rounded style when rounded prop is true', () => {
    const wrapper = mountComponent({ rounded: true })
    const skeleton = wrapper.find('.p-skeleton')
    expect(skeleton.attributes('style')).toContain('border-radius: 50%')
  })
})
