import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NSkeleton } from 'naive-ui'
import BaseSkeleton from '../BaseSkeleton.vue'

describe('BaseSkeleton.vue', () => {
  it('renders with default props', () => {
    const wrapper = mount(BaseSkeleton)

    const skeleton = wrapper.findComponent(NSkeleton)
    expect(skeleton.exists()).toBe(true)
    expect(skeleton.props('width')).toBe('100%')
    expect(skeleton.props('height')).toBe('20px')
    expect(skeleton.props('sharp')).toBe(true)
  })

  it('renders with custom width and height', () => {
    const wrapper = mount(BaseSkeleton, {
      props: {
        width: '50px',
        height: '50px',
      },
    })

    const skeleton = wrapper.findComponent(NSkeleton)
    expect(skeleton.props('width')).toBe('50px')
    expect(skeleton.props('height')).toBe('50px')
  })

  it('applies full border radius when rounded is true', () => {
    const wrapper = mount(BaseSkeleton, {
      props: {
        rounded: true,
      },
    })

    const skeleton = wrapper.findComponent(NSkeleton)
    expect(skeleton.props('circle')).toBe(true)
    expect(skeleton.props('sharp')).toBe(false)
  })

  it('applies custom classes', () => {
    const wrapper = mount(BaseSkeleton, {
      props: {
        customClass: 'my-custom-class',
      },
    })

    const skeleton = wrapper.findComponent(NSkeleton)
    expect(skeleton.classes()).toContain('my-custom-class')
  })
})
