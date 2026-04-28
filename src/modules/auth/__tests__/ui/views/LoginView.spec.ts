import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { h, defineComponent } from 'vue'

// Mock message API - must be defined before vi.mock hoists
const mockMessage = {
  success: vi.fn(),
  error: vi.fn(),
}

// Mock naive-ui with factory function (hoisted, so everything inside must be self-contained)
vi.mock('naive-ui', () => {
  const MockNInput = defineComponent({
    props: ['value', 'type', 'placeholder', 'disabled'],
    emits: ['update:value'],
    setup(props: { type?: string; value?: string; placeholder?: string; disabled?: boolean }, { emit }: { emit: (event: string, value: unknown) => void }) {
      return () =>
        h('input', {
          type: props.type || 'text',
          value: props.value,
          placeholder: props.placeholder,
          disabled: props.disabled,
          onInput: (e: Event) => emit('update:value', (e.target as HTMLInputElement).value),
        })
    },
  })

  const MockNButton = defineComponent({
    props: ['disabled', 'loading', 'type', 'block', 'quaternary'],
    emits: ['click'],
    setup(props: { disabled?: boolean; loading?: boolean; type?: string }, { emit, slots }: { emit: (event: string) => void; slots: unknown }) {
      return () =>
        h(
          'button',
          {
            type: props.type || 'button',
            disabled: props.disabled || props.loading,
            onClick: () => emit('click'),
          },
          slots,
        )
    },
  })

  const MockNCard = defineComponent({
    setup(_props: unknown, { slots }: { slots: unknown }) {
      return () => h('div', { class: 'n-card' }, slots)
    },
  })

  const MockNSpace = defineComponent({
    props: ['vertical', 'align', 'size'],
    setup(_props: unknown, { slots }: { slots: unknown }) {
      return () => h('div', { class: 'n-space' }, slots)
    },
  })

  const MockNText = defineComponent({
    props: ['strong', 'depth'],
    setup(_props: unknown, { slots }: { slots: unknown }) {
      return () => h('span', { class: 'n-text' }, slots)
    },
  })

  const MockNDivider = defineComponent({
    props: ['titlePlacement'],
    setup(_props: unknown, { slots }: { slots: unknown }) {
      return () => h('div', { class: 'n-divider' }, slots)
    },
  })

  return {
    NInput: MockNInput,
    NButton: MockNButton,
    NCard: MockNCard,
    NSpace: MockNSpace,
    NText: MockNText,
    NDivider: MockNDivider,
    useMessage: () => mockMessage,
  }
})

// Import after mocks are defined
import LoginView from '../../../ui/views/LoginView.vue'

// Mock DI container
const mockAuthService = {
  signInWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
}

const mockVaultCryptoManager = {
  initialize: vi.fn(),
}

const mockSyncEngine = {
  trigger: vi.fn(),
}

vi.mock('@/core/di', () => ({
  container: {
    resolve: vi.fn((token: string) => {
      switch (token) {
        case 'AuthService':
          return mockAuthService
        case 'VaultCryptoManager':
          return mockVaultCryptoManager
        case 'SyncEngine':
          return mockSyncEngine
        default:
          return {}
      }
    }),
  },
}))

vi.mock('@/core/di-tokens', () => ({
  DI_TOKENS: {
    AuthService: 'AuthService',
    VaultCryptoManager: 'VaultCryptoManager',
    SyncEngine: 'SyncEngine',
  },
}))

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render login form with email and password inputs', () => {
    const wrapper = mount(LoginView)

    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(2)

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')

    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
  })

  it('should have submit button', () => {
    const wrapper = mount(LoginView)

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.exists()).toBe(true)
  })

  it('should have Google login button', () => {
    const wrapper = mount(LoginView)

    // The Google button has id "login-google-btn"
    const googleButton = wrapper.find('#login-google-btn')
    expect(googleButton.exists()).toBe(true)
  })

  it('should update email value on input', async () => {
    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('input[type="text"]')
    await emailInput.setValue('test@example.com')

    expect((emailInput.element as HTMLInputElement).value).toBe('test@example.com')
  })

  it('should update password value on input', async () => {
    const wrapper = mount(LoginView)

    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('password123')

    expect((passwordInput.element as HTMLInputElement).value).toBe('password123')
  })

  it('should toggle between login and register mode', async () => {
    const wrapper = mount(LoginView)

    // Initially shows login button text
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.text()).toContain('Entrar')

    // Click toggle button
    const toggleButton = wrapper.find('#toggle-auth-mode')
    await toggleButton.trigger('click')

    // Now should show register button text
    expect(submitButton.text()).toContain('Criar conta')
  })

  it('should show loading state when submitting', async () => {
    mockAuthService.signInWithEmail.mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Button should be disabled during loading
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('should call signInWithEmail on form submit in login mode', async () => {
    mockAuthService.signInWithEmail.mockResolvedValue(undefined)
    mockVaultCryptoManager.initialize.mockResolvedValue(undefined)

    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(mockAuthService.signInWithEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should call registerWithEmail on form submit in register mode', async () => {
    mockAuthService.registerWithEmail.mockResolvedValue(undefined)
    mockVaultCryptoManager.initialize.mockResolvedValue(undefined)

    const wrapper = mount(LoginView)

    // Toggle to register mode
    const toggleButton = wrapper.find('#toggle-auth-mode')
    await toggleButton.trigger('click')

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('newuser@example.com')
    await passwordInput.setValue('password123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(mockAuthService.registerWithEmail).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'password123',
    })
  })

  it('should show success message on successful login', async () => {
    mockAuthService.signInWithEmail.mockResolvedValue(undefined)
    mockVaultCryptoManager.initialize.mockResolvedValue(undefined)

    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(mockMessage.success).toHaveBeenCalledWith('Login realizado com sucesso!')
  })

  it('should show error message on login failure', async () => {
    mockAuthService.signInWithEmail.mockRejectedValue(new Error('Invalid credentials'))

    const wrapper = mount(LoginView)

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('wrongpassword')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(mockMessage.error).toHaveBeenCalledWith('Invalid credentials')
  })

  it('should call signInWithGoogle when Google button is clicked', async () => {
    mockAuthService.signInWithGoogle.mockResolvedValue(undefined)

    const wrapper = mount(LoginView)

    const googleButton = wrapper.find('#login-google-btn')
    await googleButton.trigger('click')
    await flushPromises()

    expect(mockAuthService.signInWithGoogle).toHaveBeenCalled()
  })

  it('should show error message on Google login failure', async () => {
    mockAuthService.signInWithGoogle.mockRejectedValue(new Error('Google auth failed'))

    const wrapper = mount(LoginView)

    const googleButton = wrapper.find('#login-google-btn')
    await googleButton.trigger('click')
    await flushPromises()

    expect(mockMessage.error).toHaveBeenCalledWith('Google auth failed')
  })

  it('should clear loading state after form submission', async () => {
    mockAuthService.signInWithEmail.mockResolvedValue(undefined)
    mockVaultCryptoManager.initialize.mockResolvedValue(undefined)

    const wrapper = mount(LoginView)

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    // Check that loading is cleared by verifying button is not disabled
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it('should show success message on successful registration', async () => {
    mockAuthService.registerWithEmail.mockResolvedValue(undefined)
    mockVaultCryptoManager.initialize.mockResolvedValue(undefined)

    const wrapper = mount(LoginView)

    // Toggle to register mode
    const toggleButton = wrapper.find('#toggle-auth-mode')
    await toggleButton.trigger('click')

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('newuser@example.com')
    await passwordInput.setValue('password123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(mockMessage.success).toHaveBeenCalledWith('Conta criada com sucesso!')
  })

  it('should have required attributes on inputs', () => {
    const wrapper = mount(LoginView)

    const inputs = wrapper.findAll('input')
    inputs.forEach((input) => {
      expect(input.attributes('required')).toBeDefined()
    })
  })
})
