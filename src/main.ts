import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from '@primevue/core/config'
import DiviPreset from './core/theme/diviPreset'
import Ripple from 'primevue/ripple'
import Tooltip from 'primevue/tooltip'
import AnimateOnScroll from 'primevue/animateonscroll'
import 'primeicons/primeicons.css'


import './core/styles/main.css'
import App from './App.vue'
import router from './core/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('ripple', Ripple)
app.directive('tooltip', Tooltip)
app.directive('animateonscroll', AnimateOnScroll)
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
