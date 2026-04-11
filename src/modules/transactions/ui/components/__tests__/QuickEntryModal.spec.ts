import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuickEntryModal from '../QuickEntryModal.vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
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
    predict: vi.fn(),
  }
  const mockSyncEngine = {
    enqueueSync: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Registrar mock no DI container
    vi.spyOn(container, 'resolve').mockImplementation((token) => {
      if (token === DI_TOKENS.PredictionService) return mockPredictionService
      if (token === DI_TOKENS.SyncEngine) return mockSyncEngine
      return {
        categories: [],
        wallets: [],
        fetchCategories: vi.fn(),
        fetchWallets: vi.fn(),
        saveTransaction: vi.fn().mockResolvedValue({}),
      }
    })
  })

  const mountComponent = (props = {}) => {
    return mount(QuickEntryModal, {
      props: {
        visible: true,
        ...props,
      },
      global: {
        plugins: [PrimeVue, ToastService, createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          Dialog: {
            template: '<div v-if="visible"><slot /></div>',
            props: ['visible'],
          },
          InputNumber: true,
          InputText: true,
          Select: true,
          Button: true,
        },
      },
    })
  }

  it('deve disparar predição ao digitar payee', async () => {
    mockPredictionService.predict.mockResolvedValue({
      categoryId: 'cat-predita',
      walletId: 'wallet-predita',
      confidence: 0.8,
    })

    const wrapper = mountComponent()
    const vm = wrapper.vm as unknown as {
      amount: number | null
      payee: string
      categoryId: string
      walletId: string
    }

    vm.amount = 100
    vm.payee = 'Starbucks'

    await vi.waitFor(() => expect(mockPredictionService.predict).toHaveBeenCalled())

    expect(vm.categoryId).toBe('cat-predita')
    expect(vm.walletId).toBe('wallet-predita')
  })

  it('deve chamar saveTransaction e enqueueSync ao salvar', async () => {
    const wrapper = mountComponent()
    const vm = wrapper.vm as unknown as {
      amount: number | null
      payee: string
      handleSave(): Promise<void>
    }

    vm.amount = 100
    vm.payee = 'Starbucks'

    await vm.handleSave()

    expect(mockSyncEngine.enqueueSync).toHaveBeenCalled()
    expect(wrapper.emitted('save')).toBeTruthy()
  })
})
