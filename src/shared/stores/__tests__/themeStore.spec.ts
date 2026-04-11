import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useThemeStore } from '../themeStore'

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(performance.now())
      return 0
    })

    const isDarkMatches = false
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? isDarkMatches : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    // reset DOM state
    document.documentElement.classList.remove('dark')
  })

  it('initializes with system theme by default', () => {
    const store = useThemeStore()
    expect(store.theme).toBe('system')
  })

  it('initializes from localStorage if available', () => {
    localStorage.setItem('divi-ui-theme', 'dark')
    const store = useThemeStore()
    expect(store.theme).toBe('dark')
  })

  it('setTheme updates state and localStorage', () => {
    const store = useThemeStore()
    store.setTheme('dark')

    expect(store.theme).toBe('dark')
    expect(localStorage.getItem('divi-ui-theme')).toBe('dark')
  })

  it('toggle switches between light and dark when currently system and system is light', () => {
    const store = useThemeStore()
    expect(store.isDark).toBe(false)
    store.toggle()
    expect(store.theme).toBe('dark')
    expect(store.isDark).toBe(true)
  })
})
