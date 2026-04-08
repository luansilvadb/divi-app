import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'
import type { IAuthService } from '../../domain/contracts/IAuthService'

describe('Auth Persistence Integration', () => {
  let authService: any

  beforeEach(() => {
    setActivePinia(createPinia())
    authService = {
      getCurrentUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
      signInWithGoogle: vi.fn()
    }
  })

  it('should recover user session from service on initialization', async () => {
    const mockUser = { id: '123', email: 'persisted@test.com' }
    authService.getCurrentUser.mockResolvedValueOnce(mockUser)
    
    const store = useAuthStore()
    
    // This is the "failing" part: the store currently doesn't initialize itself from a service
    // We expect the store to have an initialize method or to be initialized by a manager
    await store.initialize(authService)
    
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should update store when auth state changes in the service', () => {
    const store = useAuthStore()
    let authCallback: any

    authService.onAuthStateChange.mockImplementation((cb: any) => {
      authCallback = cb
    })

    store.initialize(authService)
    
    const newUser = { id: '456', email: 'new@test.com' }
    authCallback(newUser)
    
    expect(store.user).toEqual(newUser)
    expect(store.isAuthenticated).toBe(true)
    
    authCallback(null)
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
