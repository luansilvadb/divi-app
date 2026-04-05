import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'

import PrimeVue from '@primevue/core/config'
import DiviPreset from './core/theme/diviPreset'
import Ripple from 'primevue/ripple'
import Tooltip from 'primevue/tooltip'
import 'primeicons/primeicons.css'


import './core/styles/main.css'
import App from './App.vue'
import router from './core/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MotionPlugin)
app.directive('ripple', Ripple)
app.directive('tooltip', Tooltip)
app.use(PrimeVue, {
  theme: {
    preset: DiviPreset,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'primevue, tailwind',
      },
    }
  }
})

app.mount('#app')
