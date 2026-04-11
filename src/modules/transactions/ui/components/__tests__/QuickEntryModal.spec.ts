import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuickEntryModal from '../QuickEntryModal.vue'
import { createTestingPinia } from '@pinia/testing'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'

// Mock Naive UI useMessage
vi.mock('naive-ui', async () => {
  const actual = await vi.importActual('naive-ui')
  return {
    ...actual,
    useMessage: () => ({
      success: vi.fn(),
      error: vi.fn(),
    }),
  }
})

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
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          NModal: {
            template: '<div v-if="show"><slot /><slot name="footer" /></div>',
            props: ['show'],
          },
          NInputNumber: true,
          NInput: true,
          NSelect: true,
          NButton: true,
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
    const vm = wrapper.vm as any

    vm.amount = 100
    vm.payee = 'Starbucks'

    await vi.waitFor(() => expect(mockPredictionService.predict).toHaveBeenCalled())

    expect(vm.categoryId).toBe('cat-predita')
    expect(vm.walletId).toBe('wallet-predita')
  })

  it('deve chamar saveTransaction e enqueueSync ao salvar', async () => {
    const wrapper = mountComponent()
    const vm = wrapper.vm as any

    vm.amount = 100
    vm.payee = 'Starbucks'

    await vm.handleSave()

    expect(mockSyncEngine.enqueueSync).toHaveBeenCalled()
    expect(wrapper.emitted('save')).toBeTruthy()
  })
})
