import { describe, it, expect } from 'vitest'
import { commonTheme, darkThemeOverrides } from '../naiveTheme'

describe('Naive UI Theme Tokens (Apple Design System)', () => {
  it('should have correct Apple dark colors in dark theme', () => {
    const common = darkThemeOverrides.common
    expect(common?.bodyColor).toBe('#1C1C1E') // Apple Dark Background
    expect(common?.cardColor).toBe('#2C2C2E') // Apple Grouped Background
  })

  it('should have System Blue as the primary color across themes', () => {
    expect(commonTheme?.primaryColor).toBe('#007AFF')
  })

  it('should have standard border radius (6px for sm)', () => {
    expect(commonTheme?.borderRadius).toBe('6px')
  })

  it('should use Inter as the main font family', () => {
    expect(commonTheme?.fontFamily).toContain('Inter')
  })

  it('should use JetBrains Mono for the mono font family', () => {
    expect(commonTheme?.fontFamilyMono).toContain('JetBrains Mono')
  })
})
