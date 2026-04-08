import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemSyncIndicator from '../ItemSyncIndicator.vue'

describe('ItemSyncIndicator', () => {
  it('renders nothing when status is synced', () => {
    const wrapper = mount(ItemSyncIndicator, {
      props: {
        status: 'synced'
      }
    })
    expect(wrapper.find('.item-sync-indicator').exists()).toBe(false)
  })

  it('renders pending indicator when status is pending', () => {
    const wrapper = mount(ItemSyncIndicator, {
      props: {
        status: 'pending'
      }
    })
    expect(wrapper.find('[data-test="sync-indicator-pending"]').exists()).toBe(true)
    expect(wrapper.attributes('title')).toBe('Sincronização pendente')
  })

  it('renders failed indicator when status is failed', () => {
    const wrapper = mount(ItemSyncIndicator, {
      props: {
        status: 'failed'
      }
    })
    expect(wrapper.find('[data-test="sync-indicator-failed"]').exists()).toBe(true)
    expect(wrapper.attributes('title')).toBe('Erro na sincronização')
  })
})
