import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from '../BaseCard.vue'

describe('BaseCard.vue', () => {
  const global = {
    stubs: {
      NCard: {
        template: '<div class="n-card"><slot name="header" /><slot name="header-extra" /><slot /><slot name="footer" /></div>'
      },
      NSkeleton: true,
      NButton: true,
      BaseIconBox: true,
    },
  }

  it('renders default slot content normally', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        default: '<div class="content">Main Content</div>',
      },
      global,
    })

    expect(wrapper.html()).toContain('Main Content')
  })

  it('renders header slot if provided', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        header: 'Card Header',
      },
      global,
    })

    expect(wrapper.html()).toContain('Card Header')
  })

  it('renders footer slot if provided', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        footer: 'Card Footer',
      },
      global,
    })

    expect(wrapper.html()).toContain('Card Footer')
  })

  it('renders error state and retry button if error prop is true', async () => {
    const wrapper = mount(BaseCard, {
      props: {
        error: true,
        errorMsg: 'Custom Error Message',
        retryable: true,
      },
      global,
    })

    expect(wrapper.text()).toContain('Custom Error Message')
    const retryBtn = wrapper.findComponent({ name: 'NButton' })
    expect(retryBtn.exists()).toBe(true)

    await retryBtn.trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('renders empty state if isEmpty prop is true', () => {
    const wrapper = mount(BaseCard, {
      props: {
        isEmpty: true,
        emptyTitle: 'No Content',
      },
      global,
    })

    expect(wrapper.text()).toContain('No Content')
  })

  it('renders loading state if isLoading prop is true', () => {
    const wrapper = mount(BaseCard, {
      props: {
        isLoading: true,
      },
      global,
    })

    expect(wrapper.findComponent({ name: 'NSkeleton' }).exists()).toBe(true)
  })

  it('emits click when clickable and enter is pressed', async () => {
    const wrapper = mount(BaseCard, {
      props: {
        clickable: true,
      },
      global,
    })

    await wrapper.trigger('keydown.enter')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emits click when clickable and space is pressed', async () => {
    const wrapper = mount(BaseCard, {
      props: {
        clickable: true,
      },
      global,
    })

    await wrapper.trigger('keydown.space')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
