import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardView from '../DashboardView.vue'
import { createTestingPinia } from '@pinia/testing'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { useDashboardStore } from '@/modules/dashboard/application/stores/dashboardStore'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import { DiviDatabase } from '@/infrastructure/db/DexieDB'
import { DexieTransactionRepository } from '@/modules/transactions/infrastructure/DexieTransactionRepository'
import Dexie from 'dexie'
import { indexedDB, IDBKeyRange } from 'fake-indexeddb'

Dexie.dependencies.indexedDB = indexedDB
Dexie.dependencies.IDBKeyRange = IDBKeyRange

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

  it('should reactively update when a transaction is added to the repository', async () => {
    // This test requires a real repository and db mock (fake-indexeddb)
    const db = new DiviDatabase('TestReactiveDB')
    const repository = new DexieTransactionRepository(db)
    ;(container.resolve as any).mockImplementation((token: any) => {
      if (token === DI_TOKENS.TransactionRepository) return repository
      return { sanitize: (i: any) => i, getFallback: () => '' }
    })

    const wrapper = mount(DashboardView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
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

    // Initially empty
    expect(wrapper.text()).toContain('Nenhuma transação registrada')

    // Add transaction directly to DB
    await repository.save({
      id: '018ebb00-0000-7000-8000-000000000001',
      user_id: 'u1',
      title: 'New Transaction',
      amount: 50,
      type: 'income',
      category_id: 'c1',
      wallet_id: 'w1',
      date: new Date().toISOString(),
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Wait for Dexie liveQuery and Vue reactivity
    // This might be tricky in tests, might need some delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Check if it's no longer empty and contains the new transaction
    // (Note: we need to implement the watchAll binding first for this to work)
    expect(wrapper.text()).not.toContain('Nenhuma transação registrada')
    expect(wrapper.text()).toContain('New Transaction')
    
    await db.delete()
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
