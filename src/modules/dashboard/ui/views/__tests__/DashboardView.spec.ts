import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardView from '../DashboardView.vue'
import { createTestingPinia } from '@pinia/testing'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { useDashboardStore } from '@/modules/dashboard/application/stores/dashboardStore'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'

// Mock dependencies
vi.mock('@/core/di', () => ({
  container: {
    resolve: vi.fn()
  }
}))

vi.mock('@/shared/utils/asset-loader', () => ({
  AssetLoader: vi.fn()
}))

describe('DashboardView', () => {
  let transactionStore: any
  let dashboardStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock AssetLoader
    const mockAssetLoader = {
      sanitize: vi.fn(i => i),
      getFallback: vi.fn(() => 'fallback.png')
    }
    
    // Mock TransactionRepository
    const mockRepo = {
      getAll: vi.fn().mockResolvedValue([]),
      getByMonth: vi.fn().mockResolvedValue([]),
      watchAll: vi.fn(() => ({ subscribe: vi.fn(), unsubscribe: vi.fn() }))
    }

    ;(container.resolve as any).mockImplementation((token: any) => {
      if (token === DI_TOKENS.AssetLoader) return mockAssetLoader
      if (token === DI_TOKENS.TransactionRepository) return mockRepo
      return {}
    })
  })

  it('should display the "empty state" message when there are no transactions', () => {
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              transactions: {
                transactions: [],
                categoryMap: {},
                walletMap: {},
                totalIncome: 0,
                totalExpense: 0
              },
              dashboard: {
                // Mock dashboard store state if needed
              }
            }
          })
        ],
        stubs: {
          StandardPageLayout: { template: '<div><slot /></div>' },
          BaseCard: { template: '<div><slot /></div>' },
          BaseButton: { template: '<button><slot /></button>' },
          AccountCarousel: true,
          PatrimonialChart: true,
          SelectButton: true
        }
      }
    })

    transactionStore = useTransactionStore()
    dashboardStore = useDashboardStore()

    expect(wrapper.text()).toContain('Nenhuma transação registrada')
    expect(wrapper.text()).toContain('Que tal começar agora?')
    
    const ctaButton = wrapper.findAll('button').find(b => b.text().includes('Começar'))
    expect(ctaButton).toBeDefined()
  })

  it('should display an error banner if IndexedDB fails to initialize', async () => {
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              transactions: { transactions: [], categoryMap: {}, walletMap: {} },
              dashboard: { initializationError: true }
            }
          })
        ],
        stubs: {
          StandardPageLayout: { template: '<div><slot /></div>' },
          BaseCard: { template: '<div><slot /></div>' },
          BaseButton: true,
          AccountCarousel: true,
          PatrimonialChart: true,
          SelectButton: true
        }
      }
    })

    expect(wrapper.text()).toContain('O modo anônimo pode limitar algumas funcionalidades')
  })

  it('should call saveTransaction when CTA button is clicked', async () => {
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          StandardPageLayout: { template: '<div><slot /></div>' },
          BaseCard: { template: '<div><slot /></div>' },
          BaseButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          AccountCarousel: true,
          PatrimonialChart: true,
          SelectButton: true
        }
      }
    })

    const transactionStore = useTransactionStore()
    const ctaButton = wrapper.findAll('button').find(b => b.text().includes('Começar'))
    
    await ctaButton?.trigger('click')
    
    expect(transactionStore.saveTransaction).toHaveBeenCalled()
  })
})
