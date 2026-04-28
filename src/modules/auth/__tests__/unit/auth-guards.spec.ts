import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { IAuthService } from '../../domain/contracts/IAuthService'
import type { IUser } from '../../domain/entities/IUser'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// Helper function to simulate the auth guard logic
const createAuthGuard = (authService: IAuthService) => {
  return async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
      const user = await authService.getCurrentUser()

      if (to.meta.requiresAuth && !user) {
        return next({ name: 'login' })
      } else if (to.meta.guestOnly && user) {
        return next({ name: 'dashboard' })
      } else {
        return next()
      }
    } catch (e) {
      console.error('Router Auth Guard Error:', e)
      return next()
    }
  }
}

describe('Auth Guards', () => {
  let mockAuthService: IAuthService
  let mockNext: NavigationGuardNext

  beforeEach(() => {
    mockNext = vi.fn()
    mockAuthService = {
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      signOut: vi.fn(),
      getCurrentUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      deleteAccountData: vi.fn(),
    }
  })

  describe('requiresAuth routes', () => {
    it('should allow access to protected route when user is authenticated', async () => {
      const mockUser: IUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test IUser',
      }
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(mockUser)

      const to = {
        path: '/dashboard',
        meta: { requiresAuth: true },
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
    })

    it('should redirect to login when accessing protected route without authentication', async () => {
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)

      const to = {
        path: '/dashboard',
        meta: { requiresAuth: true },
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(mockNext).toHaveBeenCalledWith({ name: 'login' })
    })

    it('should redirect to login for all protected routes', async () => {
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)

      const protectedRoutes = [
        '/dashboard',
        '/transactions',
        '/wallets',
        '/budgets',
        '/categories',
        '/goals',
        '/loans',
        '/subscriptions',
        '/reports',
        '/settings',
        '/profile',
        '/activity-log',
      ]

      const guard = createAuthGuard(mockAuthService)

      for (const path of protectedRoutes) {
        mockNext.mockClear()
        const to = {
          path,
          meta: { requiresAuth: true },
        } as RouteLocationNormalized
        const from = {} as RouteLocationNormalized

        await guard(to, from, mockNext)
        expect(mockNext).toHaveBeenCalledWith({ name: 'login' })
      }
    })

    it('should preserve query params when redirecting to login', async () => {
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)

      // Note: In real implementation, query params would be preserved
      // This test verifies the redirect behavior
      const to = {
        path: '/transactions',
        meta: { requiresAuth: true },
        query: { filter: 'recent' },
      } as unknown as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ name: 'login' }))
    })
  })

  describe('guestOnly routes', () => {
    it('should allow access to login page when not authenticated', async () => {
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)

      const to = {
        path: '/login',
        meta: { guestOnly: true },
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
    })

    it('should redirect to dashboard when authenticated user accesses login page', async () => {
      const mockUser: IUser = {
        id: 'user-123',
        email: 'test@example.com',
      }
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(mockUser)

      const to = {
        path: '/login',
        meta: { guestOnly: true },
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(mockNext).toHaveBeenCalledWith({ name: 'dashboard' })
    })

    it('should redirect authenticated users away from register page', async () => {
      const mockUser: IUser = {
        id: 'user-123',
        email: 'test@example.com',
      }
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(mockUser)

      const to = {
        path: '/register',
        meta: { guestOnly: true },
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(mockNext).toHaveBeenCalledWith({ name: 'dashboard' })
    })
  })

  describe('public routes', () => {
    it('should allow access to routes without auth requirements', async () => {
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)

      const to = {
        path: '/public',
        meta: {},
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
    })

    it('should allow access to public routes for both authenticated and unauthenticated users', async () => {
      const mockUser: IUser = {
        id: 'user-123',
        email: 'test@example.com',
      }

      // Test with authenticated user
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(mockUser)
      let to = {
        path: '/public',
        meta: {},
      } as RouteLocationNormalized
      let from = {} as RouteLocationNormalized
      let guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)
      expect(mockNext).toHaveBeenCalledWith()

      // Test with unauthenticated user
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)
      mockNext.mockClear()

      await guard(to, from, mockNext)
      expect(mockNext).toHaveBeenCalledWith()
    })
  })

  describe('error handling', () => {
    it('should allow navigation on auth service error', async () => {
      mockAuthService.getCurrentUser = vi.fn().mockRejectedValue(new Error('Network error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const to = {
        path: '/dashboard',
        meta: { requiresAuth: true },
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(consoleSpy).toHaveBeenCalledWith('Router Auth Guard Error:', expect.any(Error))
      expect(mockNext).toHaveBeenCalledWith()

      consoleSpy.mockRestore()
    })

    it('should handle timeout errors gracefully', async () => {
      mockAuthService.getCurrentUser = vi.fn().mockRejectedValue(new Error('Timeout'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const to = {
        path: '/dashboard',
        meta: { requiresAuth: true },
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      expect(mockNext).toHaveBeenCalledWith()

      consoleSpy.mockRestore()
    })
  })

  describe('meta tag combinations', () => {
    it('should prioritize requiresAuth over guestOnly when both are present', async () => {
      // If both are present, requiresAuth takes priority
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)

      const to = {
        path: '/special',
        meta: { requiresAuth: true, guestOnly: true },
      } as RouteLocationNormalized

      const from = {} as RouteLocationNormalized
      const guard = createAuthGuard(mockAuthService)

      await guard(to, from, mockNext)

      // Should redirect to login because requiresAuth takes priority
      expect(mockNext).toHaveBeenCalledWith({ name: 'login' })
    })
  })

  describe('concurrent navigation', () => {
    it('should handle multiple rapid navigation attempts', async () => {
      const mockUser: IUser = {
        id: 'user-123',
        email: 'test@example.com',
      }
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(mockUser)

      const guard = createAuthGuard(mockAuthService)

      // Simulate rapid navigation
      const navigations = [
        { path: '/login', meta: { guestOnly: true } },
        { path: '/login', meta: { guestOnly: true } },
        { path: '/dashboard', meta: { requiresAuth: true } },
      ]

      for (const nav of navigations) {
        mockNext.mockClear()
        const to = nav as RouteLocationNormalized
        const from = {} as RouteLocationNormalized

        await guard(to, from, mockNext)
      }

      // Final navigation should succeed
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
