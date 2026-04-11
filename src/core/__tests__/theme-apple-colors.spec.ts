import { describe, it, expect, beforeAll } from 'vitest'
import '../styles/theme.css'

describe('Apple System Colors', () => {
  it('should define Apple System Blue correctly for light mode', () => {
    const blue = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-system-blue')
      .trim()
      .toUpperCase()
    expect(blue).toBe('#007AFF')
  })

  it('should define Apple System Pink correctly for light mode', () => {
    const pink = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-system-pink')
      .trim()
      .toUpperCase()
    expect(pink).toBe('#FF2D55')
  })

  it('should define Apple System Background for light mode', () => {
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-system-background')
      .trim()
      .toUpperCase()
    expect(bg).toBe('#FFFFFF')
  })

  describe('Dark Mode', () => {
    beforeAll(() => {
      document.documentElement.classList.add('dark')
    })

    it('should define Apple System Blue correctly for dark mode', () => {
      const blue = getComputedStyle(document.documentElement)
        .getPropertyValue('--apple-system-blue')
        .trim()
        .toUpperCase()
      expect(blue).toBe('#0A84FF')
    })

    it('should define Apple System Background for dark mode', () => {
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue('--apple-system-background')
        .trim()
        .toUpperCase()
      expect(bg).toBe('#000000')
    })
  })
})
