import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { useAuthStore } from '../authStore'
import type { IAuthService } from '../../domain/contracts/IAuthService'
import type { IUser } from '../../domain/entities/IUser'

describe('Auth Persistence Integration', () => {
  let authService: {
    getCurrentUser: Mock
    onAuthStateChange: Mock
    signOut: Mock
    signInWithGoogle: Mock
    signInWithEmail: Mock
    registerWithEmail: Mock
    deleteAccountData: Mock
  }
  let vaultCryptoManager: {
    lock: Mock
  }
  let syncEngine: {
    trigger: Mock
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    authService = {
      getCurrentUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      deleteAccountData: vi.fn().mockResolvedValue(undefined),
    }
    vaultCryptoManager = {
      lock: vi.fn(),
    }
    syncEngine = {
      trigger: vi.fn(),
    }
  })

  it('should recover user session from service on initialization', async () => {
    const mockUser: IUser = { id: '123', email: 'persisted@test.com' }
    authService.getCurrentUser.mockResolvedValueOnce(mockUser)

    const store = useAuthStore()

    await store.initialize(authService as IAuthService, vaultCryptoManager as any, syncEngine as any)

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should update store when auth state changes in the service', async () => {
    const store = useAuthStore()
    let authCallback: (user: IUser | null) => void = () => {}

    authService.onAuthStateChange.mockImplementation((cb: (user: IUser | null) => void) => {
      authCallback = cb
    })

    await store.initialize(authService as IAuthService, vaultCryptoManager as any, syncEngine as any)

    const newUser: IUser = { id: '456', email: 'new@test.com' }
    authCallback(newUser)

    expect(store.user).toEqual(newUser)
    expect(store.isAuthenticated).toBe(true)
    expect(syncEngine.trigger).toHaveBeenCalled()

    authCallback(null)
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(vaultCryptoManager.lock).toHaveBeenCalled()
  })
})
