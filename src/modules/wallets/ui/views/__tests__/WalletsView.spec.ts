import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import walletsView from '../walletsView.vue'
import { defineComponent, h } from 'vue'
import { BehaviorSubject } from 'rxjs'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual('naive-ui')
  return {
    ...actual,
    useMessage: () => ({ success: vi.fn(), error: vi.fn() })
  }
})

describe('walletsView', () => {
  let mockwalletservice: any
  let walletsSubject: BehaviorSubject<any[]>

  beforeEach(() => {
    vi.clearAllMocks()
    walletsSubject = new BehaviorSubject<any[]>([])

    mockwalletservice = {
      wallets$: walletsSubject.asObservable(),
      loadwallets: vi.fn(),
      createIWallet: vi.fn().mockResolvedValue(undefined)
    }

    vi.spyOn(container, 'resolve').mockImplementation((token: any) => {
      if (token === DI_TOKENS.IWalletService) return mockwalletservice
      return {}
    })
  })

  it('deve listar carteiras e calcular total financeiro corretamente se houver registros', async () => {
    walletsSubject.next([
      { id: '1', name: 'Corrente', balance: 1550n, type: 'checking' },
      { id: '2', name: 'Investimento', balance: 450000n, type: 'investment' }
    ])

    const wrapper = mount(walletsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Corrente')
    expect(wrapper.text()).toContain('R$ 15,50') // Naive/Intl formatter output can vary with space, let's just check the numbers
    expect(wrapper.text()).toContain('Investimento')
    
    // 15.50 + 4500.00 = 4515.50
    expect(wrapper.text()).toContain('4.515,50') 
  })

  it('deve exibir mensagem de estado vazio inicial', async () => {
    walletsSubject.next([])

    const wrapper = mount(walletsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Nenhuma carteira configurada.')
  })

  it('abre o modal ao clicar em Nova Carteira e salva os dados corretos', async () => {
    const wrapper = mount(walletsView, {
      global: {
        stubs: {
          NModal: { template: '<div class="stub-modal"><slot /></div>' },
        }
      }
    })
    await flushPromises()

    const btnCreate = wrapper.find('#btn-create-IWallet')
    expect(btnCreate.exists()).toBe(true)
    await btnCreate.trigger('click')
    await flushPromises()

    // Em vez de interagir com DOM de componentes teleportados, vamos testar o state (VM)
    ;(wrapper.vm as any).formModel.name = 'Nova Conta'
    await (wrapper.vm as any).handleSaveIWallet()
    await flushPromises()

    expect(mockwalletservice.createIWallet).toHaveBeenCalledWith({
      name: 'Nova Conta',
      type: 'checking',
      currency: 'BRL',
      balance: 0 // Valor base sem alteração
    })
  })
})
