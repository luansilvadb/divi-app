import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BaseSearchInput from '../BaseSearchInput.vue'

describe('BaseSearchInput.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(BaseSearchInput, {
      props: {
        modelValue: '',
        placeholder: 'Search items...',
      },
    })
    const input = wrapper.findComponent({ name: 'NInput' })
    expect(input.props('placeholder')).toBe('Search items...')
  })

  it('emits update:modelValue when typing', async () => {
    const wrapper = mount(BaseSearchInput, {
      props: {
        modelValue: '',
      },
    })
    const input = wrapper.findComponent({ name: 'NInput' })
    await input.vm.$emit('update:value', 'test search')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test search'])
  })

  it('clears value when clear button is clicked', async () => {
    const wrapper = mount(BaseSearchInput, {
      props: {
        modelValue: 'some search',
      },
    })
    const input = wrapper.findComponent({ name: 'NInput' })
    await input.vm.$emit('clear')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('debounces emission when debounce prop is provided', async () => {
    vi.useFakeTimers()
    const wrapper = mount(BaseSearchInput, {
      props: {
        modelValue: '',
        debounce: 300,
      },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    await input.vm.$emit('input', 'test')

    // Should not emit immediately
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    // Fast forward time
    vi.advanceTimersByTime(300)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test'])
    vi.useRealTimers()
  })

  it('displays loading spinner when loading prop is true', () => {
    const wrapper = mount(BaseSearchInput, {
      props: {
        modelValue: '',
        loading: true,
      },
    })
    expect(wrapper.find('.i-lucide-loader-2.animate-spin').exists()).toBe(true)
  })
})
