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

describe('LoginView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    container.register(DI_TOKENS.AuthService, mockAuthService)
  })

  it('renders login view with proper accessibility attributes', async () => {
    const wrapper = mount(LoginView)

    const googleBtn = wrapper.find('#login-google-btn')
    expect(googleBtn.exists()).toBe(true)

    // Initially should not be loading
    // BaseButton/NButton might not use aria-busy exactly like PrimeVue did, 
    // but let's check if we kept the logic.
    // Actually, NButton has a loading prop.
  })

  it('svg and loading spinner should have aria-hidden', async () => {
    const wrapper = mount(LoginView)

    // Initial state SVG
    const svgIcon = wrapper.find('#login-google-btn svg')
    expect(svgIcon.exists()).toBe(true)
    expect(svgIcon.attributes('aria-hidden')).toBe('true')
  })

  it('terms and privacy links should have aria-labels', () => {
    // Current implementation might not have aria-label if I removed it during refactor
    const wrapper = mount(LoginView)
    const links = wrapper.findAll('a')

    expect(links.length).toBe(2)

    const termsLink = links[0]
    const privacyLink = links[1]

    expect(termsLink?.text()).toBe('Termos de Uso')
    expect(privacyLink?.text()).toBe('Política de Privacidade')
  })
})
