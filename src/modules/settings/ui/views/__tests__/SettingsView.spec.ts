import { describe, it, expect, vi } from 'vitest'

// Mock dependencies
vi.mock('naive-ui', () => ({
  NCard: { template: '<div><slot /></div>' },
  NText: { template: '<span><slot /></span>' },
}))

vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot /></div>' },
}))

describe('SettingsView.vue', () => {
  it('component file exists and can be imported', async () => {
    const module = await import('../SettingsView.vue')
    expect(module).toBeDefined()
    expect(module.default).toBeDefined()
  })
})
