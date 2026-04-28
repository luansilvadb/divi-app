import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTheme } from '../themeManager'

// Mock the theme store
vi.mock('../../shared/stores/themeStore', () => ({
  useThemeStore: () => ({
    initThemeObservers: vi.fn(),
    setTheme: vi.fn(),
    toggle: vi.fn(),
    theme: { value: 'system' },
    isDark: { value: false },
  }),
}))

describe('themeManager', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should return theme utilities', () => {
    const theme = useTheme()
    expect(theme).toHaveProperty('theme')
    expect(theme).toHaveProperty('isDark')
    expect(theme).toHaveProperty('setTheme')
    expect(theme).toHaveProperty('toggle')
  })
})
