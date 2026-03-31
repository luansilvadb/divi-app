import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'

import './core/styles/main.css'
import App from './App.vue'
import router from './core/router'
import { container } from './core/di'
import type { IAuthService } from './modules/auth/domain/contracts/IAuthService'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(MotionPlugin)

// Initialize Auth Listener & Cleaner
const authService = container.resolve<IAuthService>('IAuthService')

// 1. Immediately check for OAuth fragments in URL (Supabase handles this automatically, but we need to stay on page)
if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery'))) {
  console.debug('[Auth] OAuth fragment detected, keeping app mounted...')
}

// 2. Setup global state listener
authService.onAuthStateChange((user) => {
  const hash = window.location.hash
  if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
    console.debug('[Auth] Cleaning OAuth fragments from URL')
    // Use a small timeout to let Supabase process the hash before we clear it
    setTimeout(() => {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }, 100)
  }
  
  if (user) {
    console.debug('[Auth] Session active:', user.email)
    // If we are on login but have a user, the router will handle it, 
    // but we can trigger a re-eval if needed
  }
})

app.mount('#app')
