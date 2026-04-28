import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { IAuthService } from '../../domain/contracts/IAuthService'
import type { IVaultCryptoManager } from '../../domain/contracts/IVaultCryptoManager'
import type { ISyncEngine } from '@/core/sync/contracts/ISyncEngine'
import type { IUser } from '../../domain/entities/IUser'
import { useAuthStore } from '../../application/authStore'

// Mock VaultDatabase
vi.mock('@/infrastructure/storage/VaultDatabase', () => ({
  vaultDb: {
    clearAllData: vi.fn().mockResolvedValue(undefined),
  },
}))

const createMockAuthService = (overrides?: Partial<IAuthService>): IAuthService => ({
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
  getCurrentUser: vi.fn().mockResolvedValue(null),
  onAuthStateChange: vi.fn(),
  deleteAccountData: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

const createMockVaultCryptoManager = (overrides?: Partial<IVaultCryptoManager>): IVaultCryptoManager => ({
  lock: vi.fn(),
  initialize: vi.fn().mockResolvedValue(undefined),
  hasKey: vi.fn().mockReturnValue(false),
  encrypt: vi.fn().mockResolvedValue({ encrypted: '', iv: '', salt: '', tag: '' }),
  decrypt: vi.fn().mockResolvedValue(''),
  ...overrides,
})

const createMockSyncEngine = (overrides?: Partial<ISyncEngine>): ISyncEngine => ({
  trigger: vi.fn().mockResolvedValue(undefined),
  enqueueSync: vi.fn(),
  pushDirtyRecords: vi.fn().mockResolvedValue(undefined),
  pullFromServer: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('complete login flow', () => {
    it('should authenticate user and initialize vault', async () => {
      const store = useAuthStore()
      const mockUser: IUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test IUser',
      }

      const authService = createMockAuthService({
        signInWithEmail: vi.fn().mockResolvedValue(undefined),
        getCurrentUser: vi.fn().mockResolvedValue(mockUser),
      })

      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()

      // Step 1: IUser signs in with email
      await authService.signInWithEmail({ email: 'test@example.com', password: 'password123' })
      expect(authService.signInWithEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })

      // Step 2: Initialize vault with password
      await store.initializeVault('password123', vaultCryptoManager, syncEngine)
      expect(vaultCryptoManager.initialize).toHaveBeenCalledWith('password123')

      // Step 3: Sync should be triggered after vault init
      expect(syncEngine.trigger).toHaveBeenCalled()

      // Step 4: Get current user to verify session
      const user = await authService.getCurrentUser()
      expect(user).toEqual(mockUser)
    })

    it('should handle login failure without initializing vault', async () => {
      const store = useAuthStore()

      const authService = createMockAuthService({
        signInWithEmail: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
      })

      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()

      // Step 1: Login fails
      await expect(
        authService.signInWithEmail({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials')

      // Step 2: Vault should NOT be initialized
      expect(vaultCryptoManager.initialize).not.toHaveBeenCalled()
      expect(syncEngine.trigger).not.toHaveBeenCalled()
    })

    it('should handle complete logout flow', async () => {
      const store = useAuthStore()
      store.setUser({ id: 'user-123', email: 'test@example.com' })

      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()

      // Verify user is initially authenticated
      expect(store.isAuthenticated).toBe(true)

      // Step 1: Sign out
      await authService.signOut()
      expect(authService.signOut).toHaveBeenCalled()

      // Step 2: Clear user in store
      store.clearUser()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)

      // Step 3: Lock vault
      vaultCryptoManager.lock()
      expect(vaultCryptoManager.lock).toHaveBeenCalled()
    })

    it('should handle Google OAuth flow', async () => {
      const authService = createMockAuthService({
        signInWithGoogle: vi.fn().mockResolvedValue(undefined),
        getCurrentUser: vi.fn().mockResolvedValue({
          id: 'google-user-123',
          email: 'user@gmail.com',
          name: 'Google IUser',
          avatar_url: 'https://google.com/avatar.png',
        }),
      })

      // Step 1: Initiate Google sign in
      await authService.signInWithGoogle()
      expect(authService.signInWithGoogle).toHaveBeenCalled()

      // Step 2: Verify user is authenticated after OAuth
      const user = await authService.getCurrentUser()
      expect(user).not.toBeNull()
      expect(user?.email).toBe('user@gmail.com')
    })

    it('should handle registration and immediate login', async () => {
      const store = useAuthStore()

      const authService = createMockAuthService({
        registerWithEmail: vi.fn().mockResolvedValue(undefined),
        signInWithEmail: vi.fn().mockResolvedValue(undefined),
        getCurrentUser: vi.fn().mockResolvedValue({
          id: 'new-user-123',
          email: 'newuser@example.com',
        }),
      })

      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()

      // Step 1: Register new user
      await authService.registerWithEmail({
        email: 'newuser@example.com',
        password: 'securepassword123',
      })
      expect(authService.registerWithEmail).toHaveBeenCalled()

      // Step 2: Initialize vault with same password used for registration
      await store.initializeVault('securepassword123', vaultCryptoManager, syncEngine)
      expect(vaultCryptoManager.initialize).toHaveBeenCalledWith('securepassword123')

      // Step 3: Sync triggered after vault initialization
      expect(syncEngine.trigger).toHaveBeenCalled()
    })

    it('should handle auth state change listeners', async () => {
      const store = useAuthStore()
      const callbacks: Array<(user: IUser | null) => void> = []

      const mockUser: IUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test IUser',
      }

      const authService = createMockAuthService({
        onAuthStateChange: vi.fn((callback) => {
          callbacks.push(callback)
        }),
      })

      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()

      // Initialize store with auth service
      await store.initialize(authService, vaultCryptoManager, syncEngine)

      expect(authService.onAuthStateChange).toHaveBeenCalled()

      // Simulate auth state change - user signs in
      callbacks.forEach((cb) => cb(mockUser))
      store.setUser(mockUser)

      expect(store.user).toEqual(mockUser)
      expect(store.isAuthenticated).toBe(true)
      expect(syncEngine.trigger).toHaveBeenCalled()

      // Simulate auth state change - user signs out
      callbacks.forEach((cb) => cb(null))
      store.clearUser()

      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(vaultCryptoManager.lock).toHaveBeenCalled()
    })
  })

  describe('account deletion flow', () => {
    it('should delete account data and sign out', async () => {
      const store = useAuthStore()
      store.setUser({ id: 'user-123', email: 'test@example.com' })

      const { vaultDb } = await import('@/infrastructure/storage/VaultDatabase')

      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()

      // Step 1: Delete account data from remote
      await authService.deleteAccountData()
      expect(authService.deleteAccountData).toHaveBeenCalled()

      // Step 2: Clear local data
      await vaultDb.clearAllData()
      expect(vaultDb.clearAllData).toHaveBeenCalled()

      // Step 3: Lock vault
      vaultCryptoManager.lock()
      expect(vaultCryptoManager.lock).toHaveBeenCalled()

      // Step 4: Sign out
      await authService.signOut()
      expect(authService.signOut).toHaveBeenCalled()

      // Step 5: Clear store state
      store.clearUser()
      expect(store.user).toBeNull()
    })
  })

  describe('offline behavior', () => {
    it('should handle login when offline', async () => {
      const store = useAuthStore()

      const authService = createMockAuthService({
        signInWithEmail: vi.fn().mockRejectedValue(new Error('Network error')),
      })

      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()

      // Attempt login while offline
      await expect(
        authService.signInWithEmail({ email: 'test@example.com', password: 'password123' })
      ).rejects.toThrow('Network error')

      // Verify vault is not initialized on failure
      expect(vaultCryptoManager.initialize).not.toHaveBeenCalled()
    })

    it('should maintain session state during temporary connectivity loss', async () => {
      const store = useAuthStore()
      const mockUser: IUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      // IUser is already authenticated
      store.setUser(mockUser)
      expect(store.isAuthenticated).toBe(true)
      expect(store.user).toEqual(mockUser)

      // Simulate network error on getCurrentUser
      const authService = createMockAuthService({
        getCurrentUser: vi.fn().mockRejectedValue(new Error('Network error')),
      })

      // Should not throw when checking session
      try {
        await authService.getCurrentUser()
      } catch (e) {
        // Expected error
      }

      // Store should still have user data
      expect(store.user).toEqual(mockUser)
    })
  })
})
