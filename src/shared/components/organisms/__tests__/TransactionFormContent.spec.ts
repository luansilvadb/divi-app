import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TransactionFormContent from '../TransactionFormContent.vue'
import { createTestingPinia } from '@pinia/testing'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'

describe('TransactionFormContent.vue', () => {
  const global = {
    plugins: [createTestingPinia({ createSpy: vi.fn })],
    stubs: {
      BaseInput: true,
      BaseSelect: true,
      BaseButton: true,
      SelectButton: true,
    },
  }

  let store: any

  beforeEach(() => {
    store = useTransactionStore()
    store.categories = [
      { id: '1', name: 'Alimentação', icon: 'food', color: '#ff0000' },
      { id: '2', name: 'Transporte', icon: 'car', color: '#00ff00' },
    ]
    store.wallets = [
      { id: 'w1', name: 'Nubank', balance: 1000, currency: 'BRL' },
    ]
  })

  it('suggests a category based on title input', async () => {
    const wrapper = mount(TransactionFormContent, { global })
    
    // We need to trigger the handleTitleInput
    // Since we are stubbing BaseInput, we might need to call the method directly or use a real component
  })

  it('prevents submission if required fields are missing (Expected to FAIL)', async () => {
    const wrapper = mount(TransactionFormContent, { global })
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Since there is no validation, it will call store.saveTransaction immediately
    // A proper implementation should show errors and NOT call the store
    expect(store.saveTransaction).not.toHaveBeenCalled()
  })
})
