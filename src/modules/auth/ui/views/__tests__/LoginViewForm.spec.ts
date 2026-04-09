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

describe('LoginView.vue - Email/Password Form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    container.register(DI_TOKENS.AuthService, mockAuthService)
  })

  const mountOptions = {
    global: {
      plugins: [PrimeVue]
    }
  }

  it('renders email and password inputs', () => {
    const wrapper = mount(LoginView, mountOptions)
    
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    
    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
  })

  it('calls signInWithEmail when login button is clicked', async () => {
    const wrapper = mount(LoginView, mountOptions)
    
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await form.trigger('submit')
    
    expect(mockAuthService.signInWithEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('switches between Login and Register modes', async () => {
    const wrapper = mount(LoginView, mountOptions)
    
    // Initially in login mode
    const submitBtn = wrapper.find('button[type="submit"]')
    expect(submitBtn.text()).toBe('Entrar')
    
    const toggleBtn = wrapper.find('#toggle-auth-mode')
    expect(toggleBtn.exists()).toBe(true)
    
    await toggleBtn.trigger('click')
    
    // Now in register mode
    expect(submitBtn.text()).toBe('Criar conta')
    
    // Should call registerWithEmail when form submitted in register mode
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')
    
    await emailInput.setValue('new@example.com')
    await passwordInput.setValue('newpassword')
    await form.trigger('submit')
    
    expect(mockAuthService.registerWithEmail).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'newpassword'
    })
  })
})
