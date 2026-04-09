import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import LoginView from '../LoginView.vue'
import type { IAuthService } from '../../../domain/contracts/IAuthService'
import PrimeVue from 'primevue/config'

const mockAuthService: IAuthService = {
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  onAuthStateChange: vi.fn(),
}

const mockToast = {
  add: vi.fn()
}

vi.mock('primevue/usetoast', () => ({
  useToast: () => mockToast
}))

describe('LoginView.vue - Feedback (Toast)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    container.register(DI_TOKENS.AuthService, mockAuthService)
  })

  const mountOptions = {
    global: {
      plugins: [PrimeVue]
    }
  }

  it('shows success toast on successful login', async () => {
    const wrapper = mount(LoginView, mountOptions)
    vi.mocked(mockAuthService.signInWithEmail).mockResolvedValueOnce(undefined)
    
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await form.trigger('submit')
    
    expect(mockToast.add).toHaveBeenCalledWith(expect.objectContaining({
      severity: 'success',
      summary: 'Sucesso'
    }))
  })

  it('shows error toast on login failure', async () => {
    const wrapper = mount(LoginView, mountOptions)
    vi.mocked(mockAuthService.signInWithEmail).mockRejectedValueOnce(new Error('Invalid credentials'))
    
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('wrong-password')
    await form.trigger('submit')
    
    expect(mockToast.add).toHaveBeenCalledWith(expect.objectContaining({
      severity: 'error',
      summary: 'Erro',
      detail: 'Invalid credentials'
    }))
  })

  it('shows success toast on successful registration', async () => {
    const wrapper = mount(LoginView, mountOptions)
    vi.mocked(mockAuthService.registerWithEmail).mockResolvedValueOnce(undefined)
    
    // Switch to register mode
    await wrapper.find('#toggle-auth-mode').trigger('click')
    
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')
    
    await emailInput.setValue('new@example.com')
    await passwordInput.setValue('new-password')
    await form.trigger('submit')
    
    expect(mockToast.add).toHaveBeenCalledWith(expect.objectContaining({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Conta criada com sucesso!'
    }))
  })
})
