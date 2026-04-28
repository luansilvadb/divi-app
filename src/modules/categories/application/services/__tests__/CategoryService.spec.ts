import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CategoryService } from '../CategoryService'
import type { ICategoryRepository } from '@/modules/categories/core/ports/ICategoryRepository'
import type { ICategory } from '@/modules/categories/core/entities/ICategory'

// Mock de repositório
class MockCategoryRepository implements ICategoryRepository {
  public data: ICategory[] = []

  async getAll(): Promise<ICategory[]> {
    return this.data
  }

  async create(c: any): Promise<ICategory> {
    const newCat: ICategory = {
      ...c,
      id: crypto.randomUUID(),
      sync_status: 'pending',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    }
    this.data.push(newCat)
    return newCat
  }

  async update(id: string, c: any): Promise<ICategory> {
    const idx = this.data.findIndex((item) => item.id === id)
    if (idx >= 0) {
      this.data[idx] = { 
        ...this.data[idx]!, 
        ...c,
        client_updated_at: new Date().toISOString()
      } as any
      return this.data[idx]!
    }
    throw new Error('Not found')
  }

  async delete(id: string): Promise<void> {
    const idx = this.data.findIndex((item) => item.id === id)
    if (idx >= 0) {
      this.data[idx] = { ...this.data[idx]!, deleted: true } as any
    }
  }
}

// Mock auth store
vi.mock('@/modules/auth/application/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-123' },
  }),
}))

describe('CategoryService', () => {
  let repo: MockCategoryRepository
  let service: CategoryService

  beforeEach(() => {
    repo = new MockCategoryRepository()
    service = new CategoryService(repo)
  })

  it('should seed default categories if none exist', async () => {
    await service.loadCategories()
    const categories = await repo.getAll()

    expect(categories.length).toBe(3)
    expect(categories.some((c) => c.name === 'Alimentação')).toBe(true)
    expect(categories.some((c) => c.name === 'Transporte')).toBe(true)
    expect(categories.some((c) => c.name === 'Lazer')).toBe(true)
  })

  it('should not seed default categories if they already exist', async () => {
    // Add one fake category
    repo.data.push({
      id: '123',
      name: 'Custom',
      color: '#fff',
      icon: 'icon',
      user_id: 'test-user-123',
      sync_status: 'synced',
      created_at: new Date().toISOString(),
      client_updated_at: new Date().toISOString(),
      version: 1,
      deleted: false,
    })

    await service.loadCategories()
    expect(repo.data.length).toBe(1)
  })

  it('should emit categories list without deleted ones', async () => {
    repo.data.push({
      id: 'active',
      name: 'Active Cat',
      color: '#111',
      icon: 'icon',
      user_id: '123',
      sync_status: 'synced',
      version: 1,
      created_at: '',
      client_updated_at: '',
      deleted: false,
    })
    repo.data.push({
      id: 'del',
      name: 'Deleted Cat',
      color: '#111',
      icon: 'icon',
      user_id: '123',
      sync_status: 'synced',
      version: 1,
      created_at: '',
      client_updated_at: '',
      deleted: true,
    })

    await service.loadCategories()

    let emitted: ICategory[] = []
    const sub = service.categories$.subscribe((cats) => {
      emitted = cats
    })

    expect(emitted.length).toBe(1)
    expect(emitted[0]!.name).toBe('Active Cat')

    sub.unsubscribe()
  })

  it('should create new category and reload', async () => {
    await service.createCategory({
      name: 'New Custom',
      color: '#123',
      icon: 'test-icon',
    })

    // Seed runs but list has 1 item initially? 
    // Wait, initially empty -> create save -> 1 record. Is seed triggered when loadCategories called within create?
    // Let's just check if 'New Custom' exists.
    expect(repo.data.some((c) => c.name === 'New Custom')).toBe(true)
    expect(repo.data.find(c => c.name === 'New Custom')?.parent_id).toBeNull()
  })

  it('should update category', async () => {
    repo.data.push({
      id: 'updated_id',
      name: 'Old',
      color: '#111',
      icon: 'icon',
      user_id: '123',
      sync_status: 'synced',
      version: 1,
      created_at: '',
      client_updated_at: '',
      deleted: false,
    })

    await service.updateCategory('updated_id', {
      name: 'New',
      color: '#222',
      icon: 'icon2',
      parent_id: 'parent_x'
    })

    const c = repo.data.find((c) => c.id === 'updated_id')
    expect(c?.name).toBe('New')
    expect(c?.color).toBe('#222')
    expect(c?.icon).toBe('icon2')
    expect(c?.parent_id).toBe('parent_x')
  })

  it('should soft delete category and reload', async () => {
    repo.data.push({
      id: 'del_id',
      name: 'Old',
      color: '#111',
      icon: 'icon',
      user_id: '123',
      sync_status: 'synced',
      version: 1,
      created_at: '',
      client_updated_at: '',
      deleted: false,
    })

    await service.deleteCategory('del_id')
    
    // The soft delete updates repo and loadCategories filters it out
    const c = repo.data.find((c) => c.id === 'del_id')
    expect(c?.deleted).toBe(true)
  })
})

