import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGoalStore } from '../goalStore'

// Mocking container and DI
vi.mock('@/core/di', () => ({
  container: {
    resolve: vi.fn().mockReturnValue({
      getAll: vi.fn().mockResolvedValue([])
    })
  }
}))

describe('goalStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes search query to empty string', () => {
    const store = useGoalStore()
    expect(store.searchQuery).toBe('')
  })

  it('updates search query', () => {
    const store = useGoalStore()
    store.searchQuery = 'Dream'
    expect(store.searchQuery).toBe('Dream')
  })
})
