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

describe('LoginView.vue - Feedback (Message)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    container.register(DI_TOKENS.IAuthService, mockAuthService)
  })

  it('submits login form successfully', async () => {
    const wrapper = mount(LoginView)
    vi.mocked(mockAuthService.signInWithEmail).mockResolvedValueOnce(undefined)

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await form.trigger('submit')

    // Verify the auth service was called
    expect(mockAuthService.signInWithEmail).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
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

  it('submits registration form successfully', async () => {
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

    // Verify the auth service was called
    expect(mockAuthService.registerWithEmail).toHaveBeenCalledWith({ email: 'new@example.com', password: 'new-password' })
  })
})

