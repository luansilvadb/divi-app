import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseAuthService as SupabaseAuth } from '../../adapters/SupabaseAuthService'
import { supabase } from '@/core/supabase'
import type {
  UserResponse,
  AuthChangeEvent,
  Session,
  User,
} from '@supabase/supabase-js'

// Helper para criar um mock de tabela Supabase com método delete em cadeia
const createDeleteMock = (error: Error | null = null) => ({
  delete: vi.fn().mockReturnValue({
    neq: vi.fn().mockResolvedValue({ error }),
  }),
})

vi.mock('@/core/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}))

describe('SupabaseAuth', () => {
  let authService: SupabaseAuth

  beforeEach(() => {
    vi.clearAllMocks()
    authService = new SupabaseAuth(supabase)
  })

  it('should call signInWithPassword when signInWithEmail is called', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: {} as any, session: {} as any },
      error: null,
    } as any)
    await authService.signInWithEmail({ email: 'test@example.com', password: 'password123' })
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should throw error when signInWithEmail fails', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: new Error('Invalid credentials') as any,
    } as any)

    await expect(
      authService.signInWithEmail({ email: 'test@example.com', password: 'password123' }),
    ).rejects.toThrow('Invalid credentials')
  })

  it('should call signUp when registerWithEmail is called', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { user: {} as any, session: {} as any },
      error: null,
    } as any)
    await authService.registerWithEmail({ email: 'test@example.com', password: 'password123' })
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should throw error when registerWithEmail fails', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: new Error('Email already exists') as any,
    } as any)

    await expect(
      authService.registerWithEmail({ email: 'test@example.com', password: 'password123' }),
    ).rejects.toThrow('Email already exists')
  })

  it('should call signInWithOAuth when signInWithGoogle is called', async () => {
    await authService.signInWithGoogle()
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.any(String),
      },
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
        avatar_url: 'http://test.com/avatar.png',
      },
    }
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: mockSupabaseUser as unknown as User },
      error: null,
    } as UserResponse)

    const user = await authService.getCurrentUser()

    expect(supabase.auth.getUser).toHaveBeenCalled()
    expect(user).toEqual({
      id: '123',
      email: 'test@test.com',
      name: 'Test User',
      avatar_url: 'http://test.com/avatar.png',
    })
  })

  it('should return null when getCurrentUser has no user', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: null,
    } as unknown as UserResponse)

    const user = await authService.getCurrentUser()
    expect(user).toBeNull()
  })

  it('should register onAuthStateChange callback and handle user session', () => {
    const callback = vi.fn()

    // Simulate Supabase calling our callback with a session
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementationOnce((cb) => {
      cb(
        'SIGNED_IN' as AuthChangeEvent,
        {
          user: {
            id: '123',
            email: 'test@test.com',
            user_metadata: {
              full_name: 'Test User',
            },
          },
        } as unknown as Session,
      )
      return {
        data: { subscription: { unsubscribe: vi.fn(), id: '1', callback: vi.fn() } },
      } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>
    })

    authService.onAuthStateChange(callback)

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith({
      id: '123',
      email: 'test@test.com',
      name: 'Test User',
      avatar_url: undefined,
    })
  })

  it('should register onAuthStateChange callback and handle no session', () => {
    const callback = vi.fn()

    // Simulate Supabase calling our callback without a session user
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementationOnce((cb) => {
      cb('SIGNED_OUT' as AuthChangeEvent, null)
      return {
        data: { subscription: { unsubscribe: vi.fn(), id: '1', callback: vi.fn() } },
      } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>
    })

    authService.onAuthStateChange(callback)

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(null)
  })

  describe('deleteAccountData', () => {
    it('should delete records from all syncable tables successfully', async () => {
      const mockDeleteTable = createDeleteMock(null)
      vi.mocked(supabase.from).mockReturnValue(mockDeleteTable as any)

      await authService.deleteAccountData()

      // SYNCABLE_TABLES has 8 tables
      expect(supabase.from).toHaveBeenCalledTimes(8)
      expect(supabase.from).toHaveBeenCalledWith('transactions')
      expect(supabase.from).toHaveBeenCalledWith('wallets')
      expect(supabase.from).toHaveBeenCalledWith('categories')
      expect(supabase.from).toHaveBeenCalledWith('payees')
      expect(supabase.from).toHaveBeenCalledWith('loans')
      expect(supabase.from).toHaveBeenCalledWith('subscriptions')
      expect(supabase.from).toHaveBeenCalledWith('budgets')
      expect(supabase.from).toHaveBeenCalledWith('goals')
    })

    it('should call .delete().neq() on each table', async () => {
      const mockDeleteTable = createDeleteMock(null)
      vi.mocked(supabase.from).mockReturnValue(mockDeleteTable as any)

      await authService.deleteAccountData()

      expect(mockDeleteTable.delete).toHaveBeenCalledTimes(8)
      expect(mockDeleteTable.delete().neq).toHaveBeenCalledWith(
        'id',
        '00000000-0000-0000-0000-000000000000',
      )
    })

    it('should throw an error when one table fails to delete', async () => {
      const successMock = createDeleteMock(null)
      const failMock = createDeleteMock(new Error('RLS policy violation'))

      vi.mocked(supabase.from)
        .mockReturnValueOnce(successMock as any) // transactions
        .mockReturnValueOnce(failMock as any)    // wallets — fails
        .mockReturnValue(successMock as any)     // remaining tables

      await expect(authService.deleteAccountData()).rejects.toThrow('Purge parcialmente falhou em')
    })

    it('should continue deleting other tables even if one fails', async () => {
      const successMock = createDeleteMock(null)
      const failMock = createDeleteMock(new Error('policy error'))

      // wallets (index 1) fails, all others succeed
      vi.mocked(supabase.from)
        .mockReturnValueOnce(successMock as any) // transactions
        .mockReturnValueOnce(failMock as any)    // wallets — fails
        .mockReturnValue(successMock as any)

      await expect(authService.deleteAccountData()).rejects.toThrow()

      // Should have tried all 8 tables despite failure
      expect(supabase.from).toHaveBeenCalledTimes(8)
    })
  })
})
