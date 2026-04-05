import { config } from '@vue/test-utils'

config.global.directives = {
  ripple: () => {},
}

config.global.stubs = {
  Button: {
    template: '<button v-bind="$attrs"><slot /></button>'
  }
}
