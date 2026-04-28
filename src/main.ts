import './core/theme/themeInjector'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'virtual:uno.css'
import './core/styles/main.css'
import './core/theme/interactionStates.css' // Apple HIG interaction states
import App from './App.vue'
import router from './core/router'
import { vaultDb } from '@/infrastructure/storage/VaultDatabase'
import { persistenceService } from '@/infrastructure/storage/PersistenceService'
import { useDashboardStore } from './modules/dashboard/application/stores/dashboardStore'

// Garantir persistência crítica (AC #4)
persistenceService.ensurePersistence().catch(err => {
  console.error('[Boot] Persistence request failed:', err)
})

const app = createApp(App)
const pinia = createPinia()

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('[Vue Error]', {
    error: err,
    component: vm?.$options?.name || 'Anonymous',
    info,
    timestamp: new Date().toISOString(),
  })

  // Log to external monitoring service if configured
  if (import.meta.env.VITE_ERROR_REPORTING_URL) {
    fetch(import.meta.env.VITE_ERROR_REPORTING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: String(err),
        component: vm?.$options?.name,
        info,
        timestamp: new Date().toISOString(),
      }),
    }).catch((e) => console.error('[Error Reporting] Failed:', e))
  }
}

// Warn handler for development
app.config.warnHandler = (msg, vm, trace) => {
  if (import.meta.env.DEV) {
    console.warn('[Vue Warning]', msg, '\nComponent:', vm?.$options?.name, '\nTrace:', trace)
  }
}

app.use(pinia)
app.use(router)

// Initialize Database
vaultDb.open().catch((err) => {
  console.error('[Database] Failed to initialize local-first foundation:', err)
  const dashboardStore = useDashboardStore(pinia)
  dashboardStore.initializationError = true
})

app.mount('#app')
