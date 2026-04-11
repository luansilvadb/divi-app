import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import LoginView from '../LoginView.vue'
import type { IAuthService } from '../../../domain/contracts/IAuthService'

const mockAuthService: IAuthService = {
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  onAuthStateChange: vi.fn(),
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

describe('LoginView.vue - Feedback (Message)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    container.register(DI_TOKENS.AuthService, mockAuthService)
  })

  it('shows success message on successful login', async () => {
    const wrapper = mount(LoginView)
    vi.mocked(mockAuthService.signInWithEmail).mockResolvedValueOnce(undefined)

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await form.trigger('submit')

    expect(mockMessage.success).toHaveBeenCalledWith('Login realizado com sucesso!')
  })

  it('shows error message on login failure', async () => {
    const wrapper = mount(LoginView)
    vi.mocked(mockAuthService.signInWithEmail).mockRejectedValueOnce(
      new Error('Invalid credentials'),
    )

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('wrong-password')
    await form.trigger('submit')

    expect(mockMessage.error).toHaveBeenCalledWith('Invalid credentials')
  })

  it('shows success message on successful registration', async () => {
    const wrapper = mount(LoginView)
    vi.mocked(mockAuthService.registerWithEmail).mockResolvedValueOnce(undefined)

    // Switch to register mode
    await wrapper.find('#toggle-auth-mode').trigger('click')

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await emailInput.setValue('new@example.com')
    await passwordInput.setValue('new-password')
    await form.trigger('submit')

    expect(mockMessage.success).toHaveBeenCalledWith('Conta criada com sucesso!')
  })
})
