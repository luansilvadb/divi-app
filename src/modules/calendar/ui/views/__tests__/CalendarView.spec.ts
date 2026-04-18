import { describe, it, expect, vi } from 'vitest'

// Mock dependencies
vi.mock('naive-ui', () => ({
  NCard: { template: '<div><slot /></div>' },
  NCalendar: { template: '<div>Calendar</div>' },
}))

vi.mock('@/shared/components/templates/StandardPageLayout.vue', () => ({
  default: { template: '<div><slot /></div>' },
}))

describe('CalendarView.vue', () => {
  it('component file exists and can be imported', async () => {
    const module = await import('../CalendarView.vue')
    expect(module).toBeDefined()
    expect(module.default).toBeDefined()
  })
})
