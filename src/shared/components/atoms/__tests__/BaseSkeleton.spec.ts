import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseSkeleton from '../BaseSkeleton.vue'

describe('BaseSkeleton.vue', () => {
  const global = {
    plugins: [PrimeVue],
    stubs: {
      Skeleton: {
        props: ['width', 'height', 'borderRadius'],
        template:
          '<div class="p-skeleton" :data-width="width" :data-height="height" :data-radius="borderRadius"><slot /></div>',
      },
    },
  }

  it('renders with default props', () => {
    const wrapper = mount(BaseSkeleton, {
      global,
    })

    const skeleton = wrapper.find('.p-skeleton')
    expect(skeleton.exists()).toBe(true)
    expect(skeleton.attributes('data-width')).toBe('100%')
    expect(skeleton.attributes('data-height')).toBe('20px')
    expect(skeleton.attributes('data-radius')).toBe('8px')
  })

  it('renders with custom width and height', () => {
    const wrapper = mount(BaseSkeleton, {
      props: {
        width: '50px',
        height: '50px',
      },
      global,
    })

    const skeleton = wrapper.find('.p-skeleton')
    expect(skeleton.attributes('data-width')).toBe('50px')
    expect(skeleton.attributes('data-height')).toBe('50px')
  })

  it('applies full border radius when rounded is true', () => {
    const wrapper = mount(BaseSkeleton, {
      props: {
        rounded: true,
      },
      global,
    })

    const skeleton = wrapper.find('.p-skeleton')
    expect(skeleton.attributes('data-radius')).toBe('50%')
  })

  it('applies custom classes', () => {
    const wrapper = mount(BaseSkeleton, {
      props: {
        customClass: 'my-custom-class',
      },
      global,
    })

    // Skeleton wrapper should have the class passed via the template
    // In our stub, we can check wrapper classes.
    expect(wrapper.find('.p-skeleton').classes()).toContain('my-custom-class')
  })
})
