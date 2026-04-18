import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock the DI container
vi.mock('@/core/di', () => ({
  container: {
    resolve: vi.fn(() => ({
      getRecentActivities: vi.fn().mockResolvedValue([]),
    })),
  },
}))

// Mock Naive UI
vi.mock('naive-ui', () => ({
  NButton: { template: '<button><slot /></button>' },
  NCard: { template: '<div><slot /></div>' },
  NSpace: { template: '<div><slot /></div>' },
  NText: { template: '<span><slot /></span>' },
  NTag: { template: '<span><slot /></span>' },
  NEmpty: { template: '<div><slot /><slot name="icon" /><slot name="extra" /></div>' },
  NSpin: { template: '<div>Loading</div>' },
}))

// Mock StandardPageLayout
vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot /><slot name="action" /></div>' },
}))

describe('ActivityLogView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('component file exists and can be imported', async () => {
    const module = await import('../ActivityLogView.vue')
    expect(module).toBeDefined()
    expect(module.default).toBeDefined()
  })
})
