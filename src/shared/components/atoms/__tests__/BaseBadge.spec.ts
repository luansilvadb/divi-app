import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseBadge from '../BaseBadge.vue'

describe('BaseBadge.vue', () => {
  const global = {
    plugins: [PrimeVue],
  }

  it('renders default slot content', () => {
    const wrapper = mount(BaseBadge, {
      slots: {
        default: 'Custom Badge',
      },
      global,
    })

    expect(wrapper.text()).toContain('Custom Badge')
  })

  it('renders label prop if no default slot is provided', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        label: 'Prop Label',
      },
      global,
    })

    expect(wrapper.text()).toContain('Prop Label')
  })

  it('maps success status to correct PrimeVue severity', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        status: 'success',
      },
      global,
    })

    // We check that the component instance has severity success,
    // rather than looking for a DOM attribute which might be converted to classes by PrimeVue
    const badge = wrapper.findComponent({ name: 'Badge' })
    expect(badge.props('severity')).toBe('success')
  })

  it('maps error status to correct PrimeVue severity', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        status: 'error',
      },
      global,
    })

    const badge = wrapper.findComponent({ name: 'Badge' })
    expect(badge.props('severity')).toBe('danger')
  })

  it('maps warning status to correct PrimeVue severity', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        status: 'warning',
      },
      global,
    })

    const badge = wrapper.findComponent({ name: 'Badge' })
    expect(badge.props('severity')).toBe('warn')
  })

  it('maps info status to correct PrimeVue severity', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        status: 'info',
      },
      global,
    })

    const badge = wrapper.findComponent({ name: 'Badge' })
    expect(badge.props('severity')).toBe('info')
  })
})

