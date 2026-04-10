import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuickEntryModal from '../QuickEntryModal.vue'
import PrimeVue from 'primevue/config'

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
  const mountComponent = (props = {}) => {
    return mount(QuickEntryModal, {
      props: {
        visible: true,
        ...props
      },
      global: {
        plugins: [PrimeVue],
        stubs: {
          // Usar stubs simples para evitar problemas de teleport e matchMedia internos
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

  it('deve renderizar campos de Valor e Payee', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.quick-entry-amount').exists()).toBe(true)
    expect(wrapper.find('#payee').exists()).toBe(true)
  })

  it('deve emitir evento "update:visible" falso ao fechar', async () => {
    const wrapper = mountComponent()
    const vm = wrapper.vm as any
    vm.close()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
  })

  it('deve emitir "save" ao chamar handleSave com dados válidos', async () => {
    const wrapper = mountComponent()
    const vm = wrapper.vm as any
    vm.amount = 100
    vm.payee = 'Starbucks'
    
    vm.handleSave()
    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')?.[0][0]).toMatchObject({
      amount: 100,
      payee: 'Starbucks'
    })
  })
})
