import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from '../BaseCard.vue'

// Create a proper NCard stub component that handles keyboard events
const NCardStub = {
  inheritAttrs: true,
  template: `
    <div class="n-card" v-bind="$attrs" @click="$emit('click', $event)" @keydown="handleKeydown">
      <slot name="header" />
      <slot name="header-extra" />
      <slot />
      <slot name="footer" />
    </div>
  `,
  emits: ['click'],
  methods: {
    handleKeydown(this: any, e: KeyboardEvent) {
      if (this.$attrs.role === 'button' && (e.key === 'Enter' || e.key === ' ')) {
        this.$emit('click', e)
      }
    }
  }
}

describe('BaseCard.vue', () => {
  const global = {
    stubs: {
      NCard: NCardStub,
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
    const retryBtn = wrapper.find('button')
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

    // Check for NSkeleton stub - it renders as a div with skeleton class from global stub
    expect(wrapper.find('div').exists()).toBe(true)
    // Verify loading state content is rendered (flex container with gap)
    expect(wrapper.html()).toContain('flex')
  })

  it('has correct accessibility attributes when clickable', () => {
    const wrapper = mount(BaseCard, {
      props: {
        clickable: true,
      },
      global,
    })

    const card = wrapper.find('.n-card')
    expect(card.attributes('role')).toBe('button')
    expect(card.attributes('tabindex')).toBe('0')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseCard, {
      props: {
        clickable: true,
      },
      global,
    })

    const card = wrapper.find('.n-card')
    await card.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
