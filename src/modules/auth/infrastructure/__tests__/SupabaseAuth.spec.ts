import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseAuth } from '../SupabaseAuth'
import { supabase } from '@/core/supabase'
import type { AuthResponse, UserResponse, AuthChangeEvent, Session, AuthError, User } from '@supabase/supabase-js'

vi.mock('@/core/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
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

  it('should call signInWithPassword when signInWithEmail is called', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: {} as any, session: {} as any },
      error: null
    } as any)
    await authService.signInWithEmail({ email: 'test@example.com', password: 'password123' })
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('should throw error when signInWithEmail fails', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({ 
      data: { user: null, session: null }, 
      error: new Error('Invalid credentials') as unknown as AuthError
    } as any)
    
    await expect(authService.signInWithEmail({ email: 'test@example.com', password: 'password123' }))
      .rejects.toThrow('Invalid credentials')
  })

  it('should call signUp when registerWithEmail is called', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: {} as any, session: {} as any },
      error: null
    } as any)
    await authService.registerWithEmail({ email: 'test@example.com', password: 'password123' })
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('should throw error when registerWithEmail fails', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({ 
      data: { user: null, session: null }, 
      error: new Error('Email already exists') as unknown as AuthError
    } as AuthResponse)
    
    await expect(authService.registerWithEmail({ email: 'test@example.com', password: 'password123' }))
      .rejects.toThrow('Email already exists')
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
      data: { user: mockSupabaseUser as unknown as User },
      error: null
    } as UserResponse)

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
      cb('SIGNED_IN' as AuthChangeEvent, {
        user: {
          id: '123',
          email: 'test@test.com',
          user_metadata: {
            full_name: 'Test User'
          }
        }
      } as unknown as Session)
      return { data: { subscription: { unsubscribe: vi.fn(), id: '1', callback: vi.fn() } } } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>
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
      cb('SIGNED_OUT' as AuthChangeEvent, null)
      return { data: { subscription: { unsubscribe: vi.fn(), id: '1', callback: vi.fn() } } } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>
    })

    authService.onAuthStateChange(callback)
    
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(null)
  })
})

