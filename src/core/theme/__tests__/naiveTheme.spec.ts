import { describe, it, expect } from 'vitest'
import { commonTheme, darkThemeOverrides } from '../naiveTheme'

describe('Naive UI Theme Tokens (Elite Cockpit)', () => {
  it('should have correct Obsidian and Navy colors in dark theme', () => {
    const common = darkThemeOverrides.common
    expect(common?.bodyColor).toBe('#020617') // Obsidian Black
    expect(common?.cardColor).toBe('#0A192F') // Deep Navy
  })

  it('should have Muted Gold as the primary color across themes', () => {
    expect(commonTheme?.primaryColor).toBe('#B45309')
  })

  it('should have rigid border radius (2px)', () => {
    expect(commonTheme?.borderRadius).toBe('2px')
  })

  it('should use Inter as the main font family', () => {
    expect(commonTheme?.fontFamily).toContain('Inter')
  })

  it('should use JetBrains Mono for the mono font family', () => {
    expect(commonTheme?.fontFamilyMono).toContain('JetBrains Mono')
  })
})
