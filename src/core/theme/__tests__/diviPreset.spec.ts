import { describe, it, expect } from 'vitest'
import DiviPreset from '../diviPreset'

describe('DiviPreset', () => {
  it('should have all semantic colors defined', () => {
    const semantic = DiviPreset.semantic as any
    expect(semantic).toBeDefined()
    expect(semantic?.colorScheme?.light?.primary).toBeDefined()
    expect(semantic?.colorScheme?.light?.secondary).toBeDefined()
    expect(semantic?.colorScheme?.light?.error).toBeDefined()
    expect(semantic?.colorScheme?.light?.accent).toBeDefined()
    expect(semantic?.colorScheme?.light?.warn).toBeDefined()
    expect(semantic?.colorScheme?.light?.surface).toBeDefined()

    expect(semantic?.colorScheme?.dark?.primary).toBeDefined()
    expect(semantic?.colorScheme?.dark?.secondary).toBeDefined()
    expect(semantic?.colorScheme?.dark?.error).toBeDefined()
    expect(semantic?.colorScheme?.dark?.accent).toBeDefined()
    expect(semantic?.colorScheme?.dark?.warn).toBeDefined()
    expect(semantic?.colorScheme?.dark?.surface).toBeDefined()
  })

  it('should have correct surface mapping for primary text in light mode', () => {
    const surface = (DiviPreset.semantic as any)?.colorScheme?.light?.surface
    expect(surface?.[800]).toBe('#1e293b')
  })

  it('should have correct surface mapping for primary text in dark mode', () => {
    const surface = (DiviPreset.semantic as any)?.colorScheme?.dark?.surface
    expect(surface?.[50]).toBe('#f0f6fc')
  })
})

