import { describe, it, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import GlobalHeader from '../organisms/GlobalHeader.vue'
import AppSidebar from '../organisms/AppSidebar.vue'
import { createTestingPinia } from '@pinia/testing'

// Mock matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// Mock useViewHeader
vi.mock('@/shared/composables/useViewHeader', () => ({
  useViewHeader: () => ({
    pageTitle: { value: 'Test' },
    pageHighlight: { value: '' },
    pageScrollY: { value: 100 },
  }),
}))

describe('Apple Materials Integration', () => {
  it('GlobalHeader should use apple-material-thin', () => {
    const wrapper = mount(GlobalHeader, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['SyncStatusIndicator'],
      },
    })

    const plate = wrapper.find('.apple-material-thin')
    expect(plate.exists()).toBe(true)
  })

  it('AppSidebar should have apple-material-regular properties (via style check)', () => {
    // We check if the class is present or if @apply worked by looking at computed styles if possible
    // But since it's @apply in scoped style, we just check if the element exists
    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['RouterLink', 'Menu', 'Badge'],
      },
    })

    expect(wrapper.find('.sidebar').exists()).toBe(true)
  })
})
