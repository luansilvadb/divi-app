import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createPinia } from 'pinia'
import router from '../core/router'
import { MotionPlugin } from '@vueuse/motion'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('App', () => {
  it('mounts renders properly', async () => {
    const pinia = createPinia()
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, MotionPlugin],
      },
    })

    // Wait for router
    await router.isReady()

    expect(wrapper.exists()).toBe(true)
  })
})
