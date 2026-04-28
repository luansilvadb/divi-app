import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import LoginView from '../LoginView.vue'
import type { IAuthService } from '../../../core/ports/IAuthService'

const mockAuthService: IAuthService = {
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  onAuthStateChange: vi.fn(),
  deleteAccountData: vi.fn(),
}

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

describe('LoginView.vue - Email/Password Form', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    container.register(DI_TOKENS.IAuthService, mockAuthService)
  })

  it('renders email and password inputs', () => {
    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('input[type="text"]') // NInput uses type text for email usually unless specified
    const passwordInput = wrapper.find('input[type="password"]')

    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
  })

  it('calls signInWithEmail when login button is clicked', async () => {
    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await form.trigger('submit')

    expect(mockAuthService.signInWithEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('switches between Login and Register modes', async () => {
    const wrapper = mount(LoginView)

    // Initially in login mode
    const submitBtn = wrapper.find('button[type="submit"]')
    expect(submitBtn.text()).toBe('Entrar')

    const toggleBtn = wrapper.find('#toggle-auth-mode')
    expect(toggleBtn.exists()).toBe(true)

    await toggleBtn.trigger('click')

    // Now in register mode
    expect(submitBtn.text()).toBe('Criar conta')

    // Should call registerWithEmail when form submitted in register mode
    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await emailInput.setValue('new@example.com')
    await passwordInput.setValue('newpassword')
    await form.trigger('submit')

    expect(mockAuthService.registerWithEmail).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'newpassword',
    })
  })
})

