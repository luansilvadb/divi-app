import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseAuth } from '../SupabaseAuth'
import { supabase } from '@/core/supabase'

vi.mock('@/core/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn()
    }
  }
}))

describe('SupabaseAuth', () => {
  let authService: SupabaseAuth

  beforeEach(() => {
    vi.clearAllMocks()
    authService = new SupabaseAuth()
  })

  it('should call signInWithOAuth when signInWithGoogle is called', async () => {
    await authService.signInWithGoogle()
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.any(String)
      }
    })
  })

  it('should call signOut on supabase auth', async () => {
    await authService.signOut()
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })

  it('should return mapped User when getCurrentUser is called', async () => {
    const mockSupabaseUser = {
      id: '123',
      email: 'test@test.com',
      user_metadata: {
        full_name: 'Test User',
        avatar_url: 'http://test.com/avatar.png'
      }
    }
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: mockSupabaseUser },
      error: null
    } as any)

    const user = await authService.getCurrentUser()

    expect(supabase.auth.getUser).toHaveBeenCalled()
    expect(user).toEqual({
      id: '123',
      email: 'test@test.com',
      name: 'Test User',
      avatar_url: 'http://test.com/avatar.png'
    })
  })

  it('should return null when getCurrentUser has no user', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: null
    } as any)

    const user = await authService.getCurrentUser()
    expect(user).toBeNull()
  })

  it('should register onAuthStateChange callback and handle user session', () => {
    const callback = vi.fn()
    
    // Simulate Supabase calling our callback with a session
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementationOnce((cb) => {
      cb('SIGNED_IN', {
        user: {
          id: '123',
          email: 'test@test.com',
          user_metadata: {
            full_name: 'Test User'
          }
        }
      } as any)
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })

    authService.onAuthStateChange(callback)
    
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith({
      id: '123',
      email: 'test@test.com',
      name: 'Test User',
      avatar_url: undefined
    })
  })

  it('should register onAuthStateChange callback and handle no session', () => {
    const callback = vi.fn()
    
    // Simulate Supabase calling our callback without a session user
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementationOnce((cb) => {
      cb('SIGNED_OUT', null)
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })

    authService.onAuthStateChange(callback)
    
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(null)
  })
})