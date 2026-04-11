import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import AuthView from '../views/AuthView.vue'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const mockSignInWithEmail = vi.fn()
const mockRegisterWithEmail = vi.fn()
const mockSignInWithGoogle = vi.fn()

vi.mock('../../infrastructure/SupabaseAuth', () => {
  return {
    SupabaseAuth: class {
      signInWithEmail = mockSignInWithEmail
      registerWithEmail = mockRegisterWithEmail
      signInWithGoogle = mockSignInWithGoogle
    },
  }
})

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('AuthView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form by default', () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), PrimeVue],
        components: { InputText, Password, Button, Message },
      },
    })

    expect(wrapper.text()).toContain('Login')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.html()).toContain('Sign in with Google')
  })

  it('toggles between login and register modes', async () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), PrimeVue],
        components: { InputText, Password, Button, Message },
      },
    })

    expect(wrapper.text()).toContain('Need an account? Register')

    await wrapper.find('a.toggle-mode').trigger('click')

    expect(wrapper.text()).toContain('Register')
    expect(wrapper.text()).toContain('Already have an account? Login')
  })

  it('calls signInWithEmail on form submit in login mode', async () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), PrimeVue],
        components: { InputText, Password, Button, Message },
      },
    })

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(mockSignInWithEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('calls registerWithEmail on form submit in register mode', async () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), PrimeVue],
        components: { InputText, Password, Button, Message },
      },
    })

    await wrapper.find('a.toggle-mode').trigger('click')

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(mockRegisterWithEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('displays error message when login fails', async () => {
    mockSignInWithEmail.mockRejectedValue(new Error('Invalid credentials'))

    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), PrimeVue],
        components: { InputText, Password, Button, Message },
      },
    })

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('wrong')
    await wrapper.find('form').trigger('submit.prevent')

    await new Promise((resolve) => setTimeout(resolve, 0)) // Wait for promises to resolve

    expect(wrapper.text()).toContain('Invalid credentials')
  })

  it('calls signInWithGoogle when google button is clicked', async () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), PrimeVue],
        components: { InputText, Password, Button, Message },
      },
    })

    await wrapper.find('.google-btn').trigger('click')

    expect(mockSignInWithGoogle).toHaveBeenCalled()
  })
})
