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

// Mock vue-router correctly
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ path: '/' }),
    useRouter: () => ({ push: vi.fn() }),
    RouterLink: { template: '<a><slot /></a>' }
  }
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
  it('GlobalHeader should render correctly', () => {
    const wrapper = mount(GlobalHeader, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['SyncStatusIndicator'],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('AppSidebar should render correctly', () => {
    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['NLayoutSider', 'NMenu', 'NButton'],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
