import { describe, it, expect } from 'vitest'

describe('AuthView.vue', () => {
  it('component file exists and can be imported', async () => {
    const module = await import('../AuthView.vue')
    expect(module).toBeDefined()
    expect(module.default).toBeDefined()
  })
})
