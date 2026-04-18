import 'fake-indexeddb/auto'
import { config } from '@vue/test-utils'

config.global.directives = {
  ripple: () => {},
  tooltip: () => {},
}

config.global.stubs = {
  Button: {
    template: '<button v-bind="$attrs"><slot /></button>'
  },
  NButton: {
    template: '<button v-bind="$attrs"><slot name="icon" /><slot /></button>'
  },
  NSkeleton: {
    template: '<div class="skeleton" v-bind="$attrs"></div>'
  },
  NProgress: {
    template: '<div class="progress" v-bind="$attrs"></div>'
  },
  NInput: {
    template: '<input v-bind="$attrs" @input="$emit(\'update:value\', $event.target.value)" />'
  },
  NInputNumber: {
    template: '<input type="number" v-bind="$attrs" @input="$emit(\'update:value\', Number($event.target.value))" />'
  },
  NSelect: {
    template: '<select v-bind="$attrs" @change="$emit(\'update:value\', $event.target.value)"><slot /></select>'
  }
}

// JSDOM does not implement window.matchMedia — mock it globally
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
