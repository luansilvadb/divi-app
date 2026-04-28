import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { NMessageProvider } from 'naive-ui'
import ProfileView from '../ProfileView.vue'

const mountWithProviders = (initialAuth = { user: { email: 'luan@example.com' } }) =>
  mount(
    {
      // NMessageProvider wraps ProfileView to satisfy useMessage()
      components: { NMessageProvider, ProfileView },
      template: '<NMessageProvider><ProfileView /></NMessageProvider>',
    },
    {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: { auth: initialAuth },
          }),
        ],
        stubs: {
          StandardPageLayout: { template: '<div><slot /></div>' },
          RouterLink: { template: '<a><slot /></a>' },
        },
        mocks: {
          $router: { push: vi.fn() },
          $route: { name: 'profile' },
        },
      },
      attachTo: document.body,
    },
  )

describe('ProfileView.vue', () => {
  it('renders user email', () => {
    const wrapper = mountWithProviders()
    expect(wrapper.text()).toContain('luan@example.com')
    wrapper.unmount()
  })

  it('shows danger zone section with delete account button', () => {
    const wrapper = mountWithProviders()
    const btn = wrapper.find('#btn-delete-account')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toContain('EXCLUIR')
    wrapper.unmount()
  })

  it('opens purge confirmation modal when delete button is clicked', async () => {
    const wrapper = mountWithProviders()
    await wrapper.find('#btn-delete-account').trigger('click')
    await wrapper.vm.$nextTick()
    // NModal teleports to document.body
    const confirmBtn = document.body.querySelector('#btn-confirm-purge')
    expect(confirmBtn).not.toBeNull()
    wrapper.unmount()
  })

  it('shows cancel button in purge modal', async () => {
    const wrapper = mountWithProviders()
    await wrapper.find('#btn-delete-account').trigger('click')
    await wrapper.vm.$nextTick()
    const cancelBtn = document.body.querySelector('#btn-cancel-purge')
    expect(cancelBtn).not.toBeNull()
    wrapper.unmount()
  })
})
