import { describe, it, expect, beforeAll } from 'vitest'
import '../styles/theme.css'
import '../styles/main.css'

describe('Apple Style Shadows', () => {
  it('should define Apple Low Shadow for light mode', () => {
    const shadow = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-shadow-low')
      .trim()
    expect(shadow).toContain('rgba(0, 0, 0, 0.1)')
  })

  it('should define Apple Medium Shadow for light mode', () => {
    const shadow = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-shadow-medium')
      .trim()
    expect(shadow).toContain('0.1') // contains some opacity reference
  })

  describe('Dark Mode Shadows', () => {
    beforeAll(() => {
      document.documentElement.classList.add('dark')
    })

    it('should define Apple Low Shadow for dark mode', () => {
      const shadow = getComputedStyle(document.documentElement)
        .getPropertyValue('--apple-shadow-low')
        .trim()
      expect(shadow).toContain('0.3') // dark mode shadow is usually more opaque
    })
  })
})
