import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import AuthView from '../views/AuthView.vue'

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

const mockMessage = {
  success: vi.fn(),
  error: vi.fn(),
}

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual('naive-ui')
  return {
    ...actual,
    useMessage: () => mockMessage,
  }
})

describe('AuthView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form by default', () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('Entrar')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true) // email is text input
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Continuar com Google')
  })

  it('toggles between login and register modes', async () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('Não tem conta? Registre-se')

    await wrapper.find('button.text-zinc-500').trigger('click')

    expect(wrapper.text()).toContain('Criar Conta')
    expect(wrapper.text()).toContain('Já tem conta? Faça login')
  })

  it('calls signInWithEmail on form submit in login mode', async () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    await wrapper.find('input[type="text"]').setValue('test@example.com')
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
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    await wrapper.find('button.text-zinc-500').trigger('click')

    await wrapper.find('input[type="text"]').setValue('test@example.com')
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
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    await wrapper.find('input[type="text"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('wrong')
    await wrapper.find('form').trigger('submit.prevent')

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockMessage.error).toHaveBeenCalledWith('Invalid credentials')
  })

  it('calls signInWithGoogle when google button is clicked', async () => {
    const wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    // Naive UI button or custom button with google text
    const googleBtn = wrapper.findAll('button').find(b => b.text().includes('Continuar com Google'))
    await googleBtn?.trigger('click')

    expect(mockSignInWithGoogle).toHaveBeenCalled()
  })
})
