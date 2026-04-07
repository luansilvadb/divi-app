import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLoanStore } from '../loanStore'

// Mocking container and DI
vi.mock('@/core/di', () => ({
  container: {
    resolve: vi.fn().mockReturnValue({
      getAll: vi.fn().mockResolvedValue([])
    })
  }
}))

describe('loanStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes search query to empty string', () => {
    const store = useLoanStore()
    expect(store.searchQuery).toBe('')
  })

  it('updates search query', () => {
    const store = useLoanStore()
    store.searchQuery = 'Bank'
    expect(store.searchQuery).toBe('Bank')
  })
})
