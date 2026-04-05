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

    expect(wrapper.attributes('style')).toContain('background-color: rgba(255, 0, 0, 0.082)')
    expect(wrapper.attributes('style')).toContain('color: rgb(255, 0, 0)')
  })

  it('applies css var color style correctly', () => {
    const wrapper = mount(BaseIconBox, {
      props: { color: 'var(--my-color)' },
    })

    expect(wrapper.attributes('style')).toContain('background-color: rgba(var(--my-color), 0.1)')
    expect(wrapper.attributes('style')).toContain('color: var(--my-color)')
  })

  it('applies default classes if no color is provided', () => {
    const wrapper = mount(BaseIconBox)
    expect(wrapper.classes()).toContain('bg-primary-main/10')
    expect(wrapper.classes()).toContain('text-primary-main')
  })
})
