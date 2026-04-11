import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
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
})
