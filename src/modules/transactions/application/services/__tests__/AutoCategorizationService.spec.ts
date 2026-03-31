import { describe, it, expect } from 'vitest'
import { AutoCategorizationService } from '../AutoCategorizationService'
import type { Category } from '@/shared/domain/entities/Category'

describe('AutoCategorizationService', () => {
  const service = new AutoCategorizationService()
  const categories: Category[] = [
    { id: '1', name: 'Entertainment' },
    { id: '2', name: 'Food' },
    { id: '3', name: 'Transportation' },
  ]

  it('should suggest Entertainment for Netflix', () => {
    const result = service.suggestCategory('Netflix Subscription', categories)
    expect(result?.name).toBe('Entertainment')
  })

  it('should suggest Food for iFood', () => {
    const result = service.suggestCategory('iFood lunch', categories)
    expect(result?.name).toBe('Food')
  })

  it('should return null for unknown title', () => {
    const result = service.suggestCategory('Unknown Item', categories)
    expect(result).toBeNull()
  })
})
