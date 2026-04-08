import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ProfileView from '../ProfileView.vue'

describe('ProfileView.vue', () => {
  it('renders user information and logs correctly', async () => {
    const wrapper = mount(ProfileView, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: { user: { email: 'luan@example.com' } }
          }
        })]
      }
    })

    expect(wrapper.text()).toContain('luan@example.com')
  })
})
