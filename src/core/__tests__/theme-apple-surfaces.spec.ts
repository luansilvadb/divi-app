import { describe, it, expect } from 'vitest'
import '../styles/theme.css'
import '../styles/main.css'

describe('Apple Style Layout & Surfaces', () => {
  it('should apply Apple Squircle radius variable to root', () => {
    const radius = getComputedStyle(document.documentElement)
      .getPropertyValue('--card-radius')
      .trim()

    // 1.25rem resolves to 20px in default jsdom (16px base)
    expect(radius).toBe('1.25rem')
  })

  it('should define the apple-squircle variable', () => {
    const squircle = getComputedStyle(document.documentElement)
      .getPropertyValue('--apple-squircle')
      .trim()
    expect(squircle).toBe('squircle')
  })
})
