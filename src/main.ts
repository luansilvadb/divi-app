import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'

import PrimeVue from '@primevue/core/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'


import './core/styles/main.css'
import App from './App.vue'
import router from './core/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MotionPlugin)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
    }
  }
})

app.mount('#app')
