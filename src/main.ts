import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'virtual:uno.css'
import './core/styles/main.css'
import App from './App.vue'
import router from './core/router'
import { db } from './core/db'
import { useDashboardStore } from './modules/dashboard/application/stores/dashboardStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize Database
db.open().catch((err) => {
  console.error('[Database] Failed to initialize local-first foundation:', err)
  const dashboardStore = useDashboardStore(pinia)
  dashboardStore.initializationError = true
})

app.mount('#app')
