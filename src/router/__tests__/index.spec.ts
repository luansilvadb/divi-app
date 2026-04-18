import { describe, it, expect } from 'vitest'
import router from '../index'

describe('Router', () => {
  it('should create router instance', () => {
    expect(router).toBeDefined()
    expect(router.currentRoute).toBeDefined()
  })

  it('should have empty routes array', () => {
    // Routes are loaded dynamically
    expect(router.options.routes).toEqual([])
  })
})
