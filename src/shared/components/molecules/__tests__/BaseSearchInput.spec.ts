import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import type { Component } from 'vue'
import BaseSearchInput from '../BaseSearchInput.vue'
import PrimeVue from 'primevue/config'

const mountWithPrimeVue = (component: Component, options = {}) => {
  return mount(component, {
    global: {
      plugins: [PrimeVue],
    },
    ...options,
  })
}

describe('BaseSearchInput.vue', () => {
  it('renders correctly', () => {
    const wrapper = mountWithPrimeVue(BaseSearchInput, {
      props: {
        modelValue: '',
        placeholder: 'Search items...',
      },
    })
    expect(wrapper.find('input').element.placeholder).toBe('Search items...')
  })

  it('emits update:modelValue when typing', async () => {
    const wrapper = mountWithPrimeVue(BaseSearchInput, {
      props: {
        modelValue: '',
      },
    })
    const input = wrapper.find('input')
    await input.setValue('test search')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test search'])
  })

  it('clears value when clear button is clicked', async () => {
    const wrapper = mountWithPrimeVue(BaseSearchInput, {
      props: {
        modelValue: 'some search',
      },
    })
    const clearButton = wrapper.find('button[aria-label="Limpar busca"]')
    await clearButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('does not contain hardcoded emerald-400 color', () => {
    const wrapper = mountWithPrimeVue(BaseSearchInput, {
      props: {
        modelValue: 'test',
      },
    })
    const html = wrapper.html()
    expect(html).not.toContain('emerald-400')
  })

  it('debounces emission when debounce prop is provided', async () => {
    vi.useFakeTimers()
    const wrapper = mountWithPrimeVue(BaseSearchInput, {
      props: {
        modelValue: '',
        debounce: 300,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test')

    // Should not emit immediately
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    // Fast forward time
    vi.advanceTimersByTime(300)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test'])
    vi.useRealTimers()
  })

  it('displays loading spinner when loading prop is true', () => {
    const wrapper = mountWithPrimeVue(BaseSearchInput, {
      props: {
        modelValue: '',
        loading: true,
      },
    })
    expect(wrapper.find('.pi-spinner.pi-spin').exists()).toBe(true)
  })
})
