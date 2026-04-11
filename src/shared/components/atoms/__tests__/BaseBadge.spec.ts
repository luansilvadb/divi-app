import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NTag } from 'naive-ui'
import BaseBadge from '../BaseBadge.vue'

describe('BaseBadge.vue', () => {
  it('renders default slot content', () => {
    const wrapper = mount(BaseBadge, {
      slots: {
        default: 'Custom Badge',
      },
    })

    expect(wrapper.text()).toContain('Custom Badge')
  })

  it('renders label prop if no default slot is provided', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        label: 'Prop Label',
      },
    })

    expect(wrapper.text()).toContain('Prop Label')
  })

  it('maps success status to correct type', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        status: 'success',
      },
    })

    const badge = wrapper.findComponent(NTag)
    expect(badge.props('type')).toBe('success')
  })

  it('maps error status to correct type', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        status: 'error',
      },
    })

    const badge = wrapper.findComponent(NTag)
    expect(badge.props('type')).toBe('error')
  })

  it('maps warning status to correct type', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        status: 'warning',
      },
    })

    const badge = wrapper.findComponent(NTag)
    expect(badge.props('type')).toBe('warning')
  })

  it('maps info status to correct type', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        status: 'info',
      },
    })

    const badge = wrapper.findComponent(NTag)
    expect(badge.props('type')).toBe('info')
  })
})
