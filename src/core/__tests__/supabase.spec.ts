import { describe, it, expect } from 'vitest'
import { supabase } from '../supabase'

describe('Supabase Singleton', () => {
  it('should export a initialized supabase client', () => {
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
  })

  it('should use the environment variables for initialization', () => {
    const expectedUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
    expect(supabase['supabaseUrl']).toBe(expectedUrl)
  })
})
