import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import SyncStatusIndicator from '../SyncStatusIndicator.vue'

describe('SyncStatusIndicator.vue', () => {
  it('renders correctly when synced', () => {
    const wrapper = mount(SyncStatusIndicator, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            sync: { status: 'synced', pendingCount: 0, lastSyncTime: null, error: null }
          }
        })]
      }
    })
    expect(wrapper.text()).toContain('Sincronizado')
    expect(wrapper.find('i').classes()).toContain('pi-check-circle')
  })

  it('renders correctly when syncing', () => {
    const wrapper = mount(SyncStatusIndicator, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            sync: { status: 'syncing', pendingCount: 0, lastSyncTime: null, error: null, isOnline: true }
          }
        })]
      }
    })
    expect(wrapper.text()).toContain('Sincronizando')
    expect(wrapper.find('i').classes()).toContain('pi-sync')
    expect(wrapper.find('i').classes()).toContain('pi-spin')
  })

  it('displays pending count', () => {
    const wrapper = mount(SyncStatusIndicator, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            sync: { status: 'synced', pendingCount: 5, lastSyncTime: null, error: null, isOnline: true }
          }
        })]
      }
    })
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('Pendente')
  })
})
