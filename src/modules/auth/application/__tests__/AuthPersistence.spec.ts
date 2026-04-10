import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { useAuthStore } from '../authStore'
import type { IAuthService } from '../../domain/contracts/IAuthService'
import type { User } from '../../domain/entities/User'

describe('Auth Persistence Integration', () => {
  let authService: {
    getCurrentUser: Mock
    onAuthStateChange: Mock
    signOut: Mock
    signInWithGoogle: Mock
    signInWithEmail: Mock
    registerWithEmail: Mock
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    authService = {
      getCurrentUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      registerWithEmail: vi.fn()
    }
  })

  it('should recover user session from service on initialization', async () => {
    const mockUser: User = { id: '123', email: 'persisted@test.com' }
    authService.getCurrentUser.mockResolvedValueOnce(mockUser)
    
    const store = useAuthStore()
    
    await store.initialize(authService as IAuthService)
    
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should update store when auth state changes in the service', async () => {
    const store = useAuthStore()
    let authCallback: (user: User | null) => void = () => {}

    authService.onAuthStateChange.mockImplementation((cb: (user: User | null) => void) => {
      authCallback = cb
    })

    await store.initialize(authService as IAuthService)
    
    const newUser: User = { id: '456', email: 'new@test.com' }
    authCallback(newUser)
    
    expect(store.user).toEqual(newUser)
    expect(store.isAuthenticated).toBe(true)
    
    authCallback(null)
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})

