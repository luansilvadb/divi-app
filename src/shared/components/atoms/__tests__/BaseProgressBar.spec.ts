import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import BaseProgressBar from '../BaseProgressBar.vue'

describe('BaseProgressBar.vue', () => {
  const global = {
    plugins: [PrimeVue],
    stubs: {
      ProgressBar: {
        props: ['value', 'showValue'],
        template: '<div class="p-progressbar" :data-value="value"><slot /></div>',
      },
    },
  }

  it('renders progress bar with correct value', () => {
    const wrapper = mount(BaseProgressBar, {
      props: {
        percentage: 75,
      },
      global,
    })

    // Search by stub's class name since findComponent doesn't always work perfectly with stubs named the same as global components
    const progressBar = wrapper.find('.p-progressbar')
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.attributes('data-value')).toBe('75')
  })

  it('renders default slot containing shimmer animation div', () => {
    const wrapper = mount(BaseProgressBar, {
      props: {
        percentage: 50,
      },
      global,
    })

    const shimmerDiv = wrapper.find('.animate-shimmer')
    expect(shimmerDiv.exists()).toBe(true)
  })
})

