import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBottomSheet from '../BaseBottomSheet.vue'
import { nextTick } from 'vue'

// Mock motion animate
vi.mock('motion', () => ({
  // eslint-disable-next-line
  animate: vi.fn(() => ({ then: (cb: any) => Promise.resolve().then(cb) }))
}))

describe('BaseBottomSheet.vue', () => {

  it('renders nothing when show is false', () => {
    const wrapper = mount(BaseBottomSheet, {
      props: {
        show: false
      },
      global: {
        stubs: {
          teleport: true,
          transition: true
        }
      }
    })

    expect(wrapper.find('.sheet-wrapper').exists()).toBe(false)
  })

  it('renders content when show is true and sets body overflow to hidden', async () => {
    const wrapper = mount(BaseBottomSheet, {
      props: {
        show: true
      },
      global: {
        stubs: {
          teleport: true,
          transition: true
        }
      },
      slots: {
        default: '<div class="test-content">Test</div>'
      }
    })

    expect(wrapper.find('.sheet-wrapper').exists()).toBe(true)
    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('emits update:show false when clicking backdrop', async () => {
    const wrapper = mount(BaseBottomSheet, {
      props: {
        show: true
      },
      global: {
        stubs: {
          teleport: true,
          transition: true
        }
      }
    })

    await wrapper.find('.sheet-backdrop').trigger('click')
    expect(wrapper.emitted('update:show')?.[0]).toEqual([false])
  })

  it('handles drag down correctly (translateY increases)', async () => {
    const wrapper = mount(BaseBottomSheet, {
      props: {
        show: true
      },
      global: {
        stubs: {
          teleport: true,
          transition: true
        }
      }
    })

    const content = wrapper.find('.cursor-grab')

    await content.trigger('touchstart', {
      touches: [{ clientY: 100 }]
    })

    await content.trigger('touchmove', {
      touches: [{ clientY: 150 }]
    })

    // Check if the component internal logic updated translateY
    expect((wrapper.vm as Record<string, unknown>).translateY).toBe(50)
  })

  it('handles drag up with resistance (translateY gets 20% multiplier)', async () => {
    const wrapper = mount(BaseBottomSheet, {
      props: {
        show: true
      },
      global: {
        stubs: {
          teleport: true,
          transition: true
        }
      }
    })

    const content = wrapper.find('.cursor-grab')

    await content.trigger('touchstart', {
      touches: [{ clientY: 100 }]
    })

    await content.trigger('touchmove', {
      touches: [{ clientY: 50 }]
    })

    // -50 * 0.2 = -10
    expect((wrapper.vm as Record<string, unknown>).translateY).toBe(-10)
  })

  it('snaps back when drag is below threshold', async () => {
    const wrapper = mount(BaseBottomSheet, {
      props: {
        show: true
      },
      global: {
        stubs: {
          teleport: true,
          transition: true
        }
      }
    })

    // Mock the sheet height since it's hard to simulate in test
    Object.defineProperty(wrapper.find('.sheet-content').element, 'clientHeight', {
      value: 800,
      configurable: true
    })

    const content = wrapper.find('.cursor-grab')

    await content.trigger('touchstart', {
      touches: [{ clientY: 100 }]
    })

    // Drag down by 100px (threshold is 240px)
    await content.trigger('touchmove', {
      touches: [{ clientY: 200 }]
    })

    // Manually force a low velocity
    ;(wrapper.vm as Record<string, unknown>).velocity = 0;

    await content.trigger('touchend')

    // Wait for the Promise resolution in the component
    await nextTick()
    await nextTick()

    // It should snap back
    expect((wrapper.vm as Record<string, unknown>).translateY).toBe(0)
    expect(wrapper.emitted('update:show')).toBeUndefined()
  })

  it('dismisses when drag is above threshold', async () => {
    const wrapper = mount(BaseBottomSheet, {
      props: {
        show: true
      },
      global: {
        stubs: {
          teleport: true,
          transition: true
        }
      }
    })

    Object.defineProperty(wrapper.find('.sheet-content').element, 'clientHeight', {
      value: 800,
      configurable: true
    })

    const content = wrapper.find('.cursor-grab')

    await content.trigger('touchstart', {
      touches: [{ clientY: 100 }]
    })

    // Drag down by 300px (threshold is 240px)
    await content.trigger('touchmove', {
      touches: [{ clientY: 400 }]
    })

    // Mock lastTime to be far enough in the past so velocity is low
    ;(wrapper.vm as Record<string, unknown>).lastTime = Date.now() - 1000;

    await content.trigger('touchend')

    await nextTick()
    await nextTick()

    // Should emit close event
    expect(wrapper.emitted('update:show')?.[0]).toEqual([false])
  })
})
