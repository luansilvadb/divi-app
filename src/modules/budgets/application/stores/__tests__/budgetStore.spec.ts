import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '../budgetStore'
import { container } from '@/core/di'

// Mocking container and DI
vi.mock('@/core/di', () => ({
  container: {
    resolve: vi.fn().mockReturnValue({
      getAllActive: vi.fn().mockResolvedValue([])
    })
  }
}))

describe('budgetStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes search query to empty string', () => {
    const store = useBudgetStore()
    expect(store.searchQuery).toBe('')
  })

  it('updates search query', () => {
    const store = useBudgetStore()
    store.searchQuery = 'Test'
    expect(store.searchQuery).toBe('Test')
  })
})
