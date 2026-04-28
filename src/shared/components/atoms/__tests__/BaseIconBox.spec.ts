import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseIconBox from '../BaseIconBox.vue'

describe('BaseIconBox.vue', () => {
  it('renders default slot content', () => {
    const wrapper = mount(BaseIconBox, {
      slots: {
        default: '<i>Icon</i>',
      },
    })

    expect(wrapper.html()).toContain('<i>Icon</i>')
  })

  it('applies default md size class', () => {
    const wrapper = mount(BaseIconBox)
    expect(wrapper.classes()).toContain('w-10')
    expect(wrapper.classes()).toContain('h-10')
  })

  it('applies sm size class', () => {
    const wrapper = mount(BaseIconBox, {
      props: { size: 'sm' },
    })
    expect(wrapper.classes()).toContain('w-8')
    expect(wrapper.classes()).toContain('h-8')
  })

  it('applies lg size class', () => {
    const wrapper = mount(BaseIconBox, {
      props: { size: 'lg' },
    })
    expect(wrapper.classes()).toContain('w-12')
    expect(wrapper.classes()).toContain('h-12')
  })

  it('applies custom color style correctly', () => {
    const wrapper = mount(BaseIconBox, {
      props: { color: '#ff0000' },
    })

    // Browser converts hex+alpha to rgba format
    expect(wrapper.attributes('style')).toContain('background-color')
    expect(wrapper.attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(wrapper.attributes('style')).toContain('border')
  })

  it('applies css var color style correctly', () => {
    const wrapper = mount(BaseIconBox, {
      props: { color: 'var(--my-color)' },
    })

    expect(wrapper.attributes('style')).toContain('background-color')
    expect(wrapper.attributes('style')).toContain('color: var(--my-color)')
  })

  it('applies default color if none is provided', () => {
    const wrapper = mount(BaseIconBox)
    // Default color is #B45309 - browser converts to rgb
    expect(wrapper.attributes('style')).toContain('background-color')
    expect(wrapper.attributes('style')).toContain('color: rgb(180, 83, 9)')
  })
})
