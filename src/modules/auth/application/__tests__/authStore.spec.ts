import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'
import type { IAuthService } from '../../core/ports/IAuthService'
import type { IVaultCryptoManager } from '../../core/ports/IVaultCryptoManager'
import type { ISyncEngine } from '@/core/sync/ports/ISyncEngine'
import type { IUser } from '../../core/entities/IUser'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'

// Mocks para dependências externas
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

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with no user', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should set user correctly', () => {
    const store = useAuthStore()
    store.setUser({ id: '1', email: 'test@example.com' })
    expect(store.user).toEqual({ id: '1', email: 'test@example.com' })
    expect(store.isAuthenticated).toBe(true)
  })

  it('should clear user correctly', () => {
    const store = useAuthStore()
    store.setUser({ id: '1', email: 'test@example.com' })
    store.clearUser()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  describe('purgeAccount', () => {
    it('should call deleteAccountData on auth service', async () => {
      const store = useAuthStore()
      store.setUser({ id: '1', email: 'test@example.com' })
      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)

      await store.purgeAccount()

      expect(authService.deleteAccountData).toHaveBeenCalledOnce()
    })

    it('should clear local database', async () => {
      const { vaultDb } = await import('@/infrastructure/storage/VaultDatabase')
      const store = useAuthStore()
      store.setUser({ id: '1', email: 'test@example.com' })
      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)

      await store.purgeAccount()

      expect(vaultDb.clearAllData).toHaveBeenCalledOnce()
    })

    it('should lock the crypto vault', async () => {
      const store = useAuthStore()
      store.setUser({ id: '1', email: 'test@example.com' })
      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)

      await store.purgeAccount()

      expect(vaultCryptoManager.lock).toHaveBeenCalledOnce()
    })

    it('should call signOut on auth service', async () => {
      const store = useAuthStore()
      store.setUser({ id: '1', email: 'test@example.com' })
      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)

      await store.purgeAccount()

      expect(authService.signOut).toHaveBeenCalledOnce()
    })

    it('should clear user state after purge', async () => {
      const store = useAuthStore()
      store.setUser({ id: '1', email: 'test@example.com' })
      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)

      await store.purgeAccount()

      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should propagate error if deleteAccountData fails', async () => {
      const store = useAuthStore()
      store.setUser({ id: '1', email: 'test@example.com' })
      const authService = createMockAuthService({
        deleteAccountData: vi.fn().mockRejectedValue(new Error('Network error')),
      })
      const vaultCryptoManager = createMockVaultCryptoManager()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)

      await expect(store.purgeAccount()).rejects.toThrow('Network error')
    })
  })

  describe('initialize', () => {
    it('should initialize with current user', async () => {
      const store = useAuthStore()
      const authService = createMockAuthService({
        getCurrentUser: vi.fn().mockResolvedValue({ id: '1', email: 'test@example.com' }),
      })
      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)
      container.register(DI_TOKENS.ISyncEngine, syncEngine)

      await store.initialize()

      expect(store.user).toEqual({ id: '1', email: 'test@example.com' })
      expect(store.isAuthenticated).toBe(true)
    })

    it('should lock vault on logout', async () => {
      const store = useAuthStore()
      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)
      container.register(DI_TOKENS.ISyncEngine, syncEngine)

      let authStateCallback: ((user: IUser | null) => void) | null = null
      authService.onAuthStateChange = vi.fn((callback: (user: IUser | null) => void) => {
        authStateCallback = callback
      })

      await store.initialize()

      if (authStateCallback) (authStateCallback as (user: IUser | null) => void)(null)

      expect(vaultCryptoManager.lock).toHaveBeenCalledOnce()
    })

    it('should trigger sync on login', async () => {
      const store = useAuthStore()
      const authService = createMockAuthService()
      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()
      
      container.register(DI_TOKENS.IAuthService, authService)
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)
      container.register(DI_TOKENS.ISyncEngine, syncEngine)

      let authStateCallback: ((user: IUser | null) => void) | null = null
      authService.onAuthStateChange = vi.fn((callback: (user: IUser | null) => void) => {
        authStateCallback = callback
      })

      await store.initialize()

      if (authStateCallback) (authStateCallback as (user: IUser | null) => void)({ id: '1', email: 'test@example.com' })

      expect(syncEngine.trigger).toHaveBeenCalledOnce()
    })
  })

  describe('initializeVault', () => {
    it('should initialize vault with password', async () => {
      const store = useAuthStore()
      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()
      
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)
      container.register(DI_TOKENS.ISyncEngine, syncEngine)

      await store.initializeVault('password123')

      expect(vaultCryptoManager.initialize).toHaveBeenCalledWith('password123')
    })

    it('should trigger sync after vault initialization', async () => {
      const store = useAuthStore()
      const vaultCryptoManager = createMockVaultCryptoManager()
      const syncEngine = createMockSyncEngine()
      
      container.register(DI_TOKENS.IVaultCryptoManager, vaultCryptoManager)
      container.register(DI_TOKENS.ISyncEngine, syncEngine)

      await store.initializeVault('password123')

      expect(syncEngine.trigger).toHaveBeenCalledOnce()
    })
  })
})

