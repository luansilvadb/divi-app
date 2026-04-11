import { describe, it, expect } from 'vitest'
import '../styles/theme.css'

describe('Apple Style Materials', () => {
  it('should define Apple Vibrancy correctly', () => {
    const vibrancy = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-vibrancy')
      .trim()
    expect(vibrancy).toBe('saturate(180%)')
  })

  it('should define Apple Blur Thin correctly', () => {
    const blur = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-blur-thin')
      .trim()
    expect(blur).toBe('20px')
  })

  it('should define Apple Blur Regular correctly', () => {
    const blur = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-blur-regular')
      .trim()
    expect(blur).toBe('40px')
  })
})
