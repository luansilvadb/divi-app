import { describe, it, expect } from 'vitest'
import { AutoCategorizationService } from '../AutoCategorizationService'
import type { Category } from '@/shared/domain/entities/Category'

describe('AutoCategorizationService', () => {
  const service = new AutoCategorizationService()
  const categories: Category[] = [
    {
      id: '1',
      name: 'Entertainment',
      sync_status: 'synced',
      user_id: '1',
      client_updated_at: '',
      created_at: '',
      version: 1,
      deleted: false,
      icon: 'category',
      color: '#000000',
    },
    {
      id: '2',
      name: 'Food',
      sync_status: 'synced',
      user_id: '1',
      client_updated_at: '',
      created_at: '',
      version: 1,
      deleted: false,
      icon: 'category',
      color: '#000000',
    },
    {
      id: '3',
      name: 'Transportation',
      sync_status: 'synced',
      user_id: '1',
      client_updated_at: '',
      created_at: '',
      version: 1,
      deleted: false,
      icon: 'category',
      color: '#000000',
    },
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
