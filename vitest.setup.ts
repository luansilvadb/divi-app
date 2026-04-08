import 'fake-indexeddb/auto'
import { config } from '@vue/test-utils'

config.global.directives = {
  ripple: () => {},
  tooltip: () => {},
}

config.global.stubs = {
  Button: {
    template: '<button v-bind="$attrs"><slot /></button>'
  }
}
