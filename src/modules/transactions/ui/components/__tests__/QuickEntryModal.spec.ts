import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuickEntryModal from '../QuickEntryModal.vue'
import PrimeVue from 'primevue/config'
import { createTestingPinia } from '@pinia/testing'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('QuickEntryModal', () => {
  const mockPredictionService = {
    predict: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Registrar mock no DI container
    vi.spyOn(container, 'resolve').mockImplementation((token) => {
      if (token === DI_TOKENS.PredictionService) return mockPredictionService
      // Fallback para outros tokens se necessário
      return {
        categories: [],
        wallets: [],
        fetchCategories: vi.fn(),
        fetchWallets: vi.fn()
      }
    })
  })

  const mountComponent = (props = {}) => {
    return mount(QuickEntryModal, {
      props: {
        visible: true,
        ...props
      },
      global: {
        plugins: [PrimeVue, createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          Dialog: {
            template: '<div v-if="visible"><slot /></div>',
            props: ['visible']
          },
          InputNumber: true,
          InputText: true,
          Select: true,
          Button: true
        }
      }
    })
  }

  it('deve disparar predição ao digitar payee', async () => {
    mockPredictionService.predict.mockResolvedValue({
      categoryId: 'cat-predita',
      walletId: 'wallet-predita',
      confidence: 0.8
    })

    const wrapper = mountComponent()
    const vm = wrapper.vm as any
    
    vm.amount = 100
    vm.payee = 'Starbucks'
    
    // Aguardar o watch. Usamos um polling simples ou waitFor do vitest
    await vi.waitFor(() => expect(mockPredictionService.predict).toHaveBeenCalled())
    
    expect(vm.categoryId).toBe('cat-predita')
    expect(vm.walletId).toBe('wallet-predita')
  })

  it('não deve sobrepor categoria se o usuário já interagiu', async () => {
    mockPredictionService.predict.mockResolvedValue({
      categoryId: 'cat-predita',
      walletId: 'wallet-predita',
      confidence: 0.8
    })

    const wrapper = mountComponent()
    const vm = wrapper.vm as any
    
    vm.amount = 100
    vm.categoryId = 'cat-usuario'
    vm.isUserInteracted.category = true
    
    vm.payee = 'Starbucks'
    
    await vi.waitFor(() => expect(mockPredictionService.predict).toHaveBeenCalled())
    
    expect(vm.categoryId).toBe('cat-usuario')
    expect(vm.walletId).toBe('wallet-predita')
  })
})
