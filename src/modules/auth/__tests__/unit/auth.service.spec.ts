import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { IAuthService } from '../../core/ports/IAuthService'
import type { IUser } from '../../core/entities/IUser'
import type { ICredentials } from '../../core/ports/ICredentials'

describe('Auth Service', () => {
  let mockAuthService: IAuthService

  beforeEach(() => {
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

  describe('login with email', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials: ICredentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      mockAuthService.signInWithEmail = vi.fn().mockResolvedValue(undefined)

      await mockAuthService.signInWithEmail(credentials)

      expect(mockAuthService.signInWithEmail).toHaveBeenCalledWith(credentials)
      expect(mockAuthService.signInWithEmail).toHaveBeenCalledTimes(1)
    })

    it('should fail login with invalid credentials', async () => {
      const credentials: ICredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }
      const error = new Error('Invalid login credentials')

      mockAuthService.signInWithEmail = vi.fn().mockRejectedValue(error)

      await expect(mockAuthService.signInWithEmail(credentials)).rejects.toThrow('Invalid login credentials')
    })

    it('should fail login with empty email', async () => {
      const credentials: ICredentials = {
        email: '',
        password: 'password123',
      }
      const error = new Error('Email is required')

      mockAuthService.signInWithEmail = vi.fn().mockRejectedValue(error)

      await expect(mockAuthService.signInWithEmail(credentials)).rejects.toThrow('Email is required')
    })

    it('should fail login with empty password', async () => {
      const credentials: ICredentials = {
        email: 'test@example.com',
        password: '',
      }
      const error = new Error('Password is required')

      mockAuthService.signInWithEmail = vi.fn().mockRejectedValue(error)

      await expect(mockAuthService.signInWithEmail(credentials)).rejects.toThrow('Password is required')
    })
  })

  describe('logout', () => {
    it('should successfully logout and clear session', async () => {
      mockAuthService.signOut = vi.fn().mockResolvedValue(undefined)
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)

      await mockAuthService.signOut()
      const user = await mockAuthService.getCurrentUser()

      expect(mockAuthService.signOut).toHaveBeenCalledTimes(1)
      expect(user).toBeNull()
    })

    it('should handle logout errors gracefully', async () => {
      const error = new Error('Network error during logout')
      mockAuthService.signOut = vi.fn().mockRejectedValue(error)

      await expect(mockAuthService.signOut()).rejects.toThrow('Network error during logout')
    })
  })

  describe('registration', () => {
    it('should successfully register with valid credentials', async () => {
      const credentials: ICredentials = {
        email: 'newuser@example.com',
        password: 'securepassword123',
      }

      mockAuthService.registerWithEmail = vi.fn().mockResolvedValue(undefined)

      await mockAuthService.registerWithEmail(credentials)

      expect(mockAuthService.registerWithEmail).toHaveBeenCalledWith(credentials)
      expect(mockAuthService.registerWithEmail).toHaveBeenCalledTimes(1)
    })

    it('should fail registration with duplicate email', async () => {
      const credentials: ICredentials = {
        email: 'existing@example.com',
        password: 'password123',
      }
      const error = new Error('IUser already registered')

      mockAuthService.registerWithEmail = vi.fn().mockRejectedValue(error)

      await expect(mockAuthService.registerWithEmail(credentials)).rejects.toThrow('IUser already registered')
    })

    it('should fail registration with weak password', async () => {
      const credentials: ICredentials = {
        email: 'test@example.com',
        password: '123',
      }
      const error = new Error('Password should be at least 6 characters')

      mockAuthService.registerWithEmail = vi.fn().mockRejectedValue(error)

      await expect(mockAuthService.registerWithEmail(credentials)).rejects.toThrow('Password should be at least 6 characters')
    })
  })

  describe('Google OAuth login', () => {
    it('should initiate Google sign in flow', async () => {
      mockAuthService.signInWithGoogle = vi.fn().mockResolvedValue(undefined)

      await mockAuthService.signInWithGoogle()

      expect(mockAuthService.signInWithGoogle).toHaveBeenCalledTimes(1)
    })

    it('should handle Google sign in errors', async () => {
      const error = new Error('Google authentication failed')
      mockAuthService.signInWithGoogle = vi.fn().mockRejectedValue(error)

      await expect(mockAuthService.signInWithGoogle()).rejects.toThrow('Google authentication failed')
    })
  })

  describe('get current user', () => {
    it('should return current user when authenticated', async () => {
      const mockUser: IUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test IUser',
        avatar_url: 'https://example.com/avatar.png',
      }

      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(mockUser)

      const user = await mockAuthService.getCurrentUser()

      expect(user).toEqual(mockUser)
    })

    it('should return null when not authenticated', async () => {
      mockAuthService.getCurrentUser = vi.fn().mockResolvedValue(null)

      const user = await mockAuthService.getCurrentUser()

      expect(user).toBeNull()
    })
  })

  describe('auth state change listener', () => {
    it('should register callback for auth state changes', () => {
      const callback = vi.fn()

      mockAuthService.onAuthStateChange(callback)

      expect(mockAuthService.onAuthStateChange).toHaveBeenCalledWith(callback)
    })

    it('should call callback when user signs in', () => {
      const mockUser: IUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test IUser',
      }
      const callback = vi.fn()

      mockAuthService.onAuthStateChange = vi.fn((cb) => {
        cb(mockUser)
      })

      mockAuthService.onAuthStateChange(callback)

      expect(callback).toHaveBeenCalledWith(mockUser)
    })

    it('should call callback with null when user signs out', () => {
      const callback = vi.fn()

      mockAuthService.onAuthStateChange = vi.fn((cb) => {
        cb(null)
      })

      mockAuthService.onAuthStateChange(callback)

      expect(callback).toHaveBeenCalledWith(null)
    })
  })

  describe('delete account data', () => {
    it('should delete all user data from remote', async () => {
      mockAuthService.deleteAccountData = vi.fn().mockResolvedValue(undefined)

      await mockAuthService.deleteAccountData()

      expect(mockAuthService.deleteAccountData).toHaveBeenCalledTimes(1)
    })

    it('should handle errors during account data deletion', async () => {
      const error = new Error('Failed to delete account data')
      mockAuthService.deleteAccountData = vi.fn().mockRejectedValue(error)

      await expect(mockAuthService.deleteAccountData()).rejects.toThrow('Failed to delete account data')
    })
  })
})

