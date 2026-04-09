import PrimeVue from "primevue/config"
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastService from 'primevue/toastservice'
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

describe('LoginView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    container.register(DI_TOKENS.AuthService, mockAuthService)
  })

  it('renders login view with proper accessibility attributes', async () => {
    const wrapper = mount(LoginView, { global: { plugins: [PrimeVue, ToastService] } })

    const googleBtn = wrapper.find('#login-google-btn')
    expect(googleBtn.exists()).toBe(true)

    // Initially should not be loading
    expect(googleBtn.attributes('aria-busy')).toBe('false')

    // Click to login
    const signInMock = vi.mocked(mockAuthService.signInWithGoogle).mockImplementation(() => {
      return new Promise((resolve) => setTimeout(resolve, 100))
    })

    await googleBtn.trigger('click')

    // Expect aria-busy to be true
    expect(googleBtn.attributes('aria-busy')).toBe('true')

    // Wait for the mock to resolve
    await new Promise((resolve) => setTimeout(resolve, 150))
    await wrapper.vm.$nextTick()

    // Expect it to be back to false
    expect(googleBtn.attributes('aria-busy')).toBe('false')

    expect(signInMock).toHaveBeenCalledOnce()
  })

  it('svg and loading spinner should have aria-hidden', async () => {
    const wrapper = mount(LoginView, { global: { plugins: [PrimeVue, ToastService] } })

    // Initial state SVG
    const svgIcon = wrapper.find('#login-google-btn svg')
    expect(svgIcon.exists()).toBe(true)
    expect(svgIcon.attributes('aria-hidden')).toBe('true')

    // Loading state
    vi.mocked(mockAuthService.signInWithGoogle).mockImplementation(() => {
      return new Promise((resolve) => setTimeout(resolve, 100))
    })

    await wrapper.find('#login-google-btn').trigger('click')

    // Wait for DOM update
    await wrapper.vm.$nextTick()

    // The spinner
    const spinner = wrapper.find('#login-google-btn .animate-spin')
    expect(spinner.exists()).toBe(true)
    expect(spinner.attributes('aria-hidden')).toBe('true')
  })

  it('terms and privacy links should have aria-labels', () => {
    const wrapper = mount(LoginView, { global: { plugins: [PrimeVue, ToastService] } })
    const links = wrapper.findAll('a')

    expect(links.length).toBe(2)

    const termsLink = links[0]
    const privacyLink = links[1]

    expect(termsLink?.text()).toBe('Termos de Uso')
    expect(termsLink?.attributes('aria-label')).toBe('Termos de Uso')

    expect(privacyLink?.text()).toBe('Política de Privacidade')
    expect(privacyLink?.attributes('aria-label')).toBe('Política de Privacidade')
  })
})
