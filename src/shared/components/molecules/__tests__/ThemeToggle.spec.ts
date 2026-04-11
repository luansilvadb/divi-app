import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ThemeToggle from '../ThemeToggle.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/shared/stores/themeStore'

describe('ThemeToggle.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(performance.now())
      return 0
    })

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders correctly', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('displays the moon icon when in light mode', () => {
    const store = useThemeStore()
    store.setTheme('light')

    const wrapper = mount(ThemeToggle)
    const icon = wrapper.find('i')

    expect(icon.classes()).toContain('i-lucide-moon')
    expect(icon.classes()).not.toContain('i-lucide-sun')
  })

  it('displays the sun icon when in dark mode', async () => {
    const store = useThemeStore()
    store.setTheme('dark')

    const wrapper = mount(ThemeToggle)
    const icon = wrapper.find('i')

    expect(icon.classes()).toContain('i-lucide-sun')
    expect(icon.classes()).not.toContain('i-lucide-moon')
  })

  it('toggles theme when clicked', async () => {
    const store = useThemeStore()
    store.setTheme('light')

    const wrapper = mount(ThemeToggle)

    await wrapper.find('button').trigger('click')

    expect(store.theme).toBe('dark')

    await wrapper.find('button').trigger('click')

    expect(store.theme).toBe('light')
  })
})
