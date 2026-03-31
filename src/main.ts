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

// Initialize Auth Listener
const authService = container.resolve<IAuthService>('IAuthService')

authService.onAuthStateChange((user) => {
  // If we have a hash in the URL (likely from Google OAuth return), 
  // clear it to keep the URL clean after Supabase handles the session
  if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery'))) {
    // We use replaceState to avoid adding a history entry
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  
  if (user) {
    console.debug('[Auth] User session established:', user.email)
  } else {
    console.debug('[Auth] No active session')
  }
})

app.mount('#app')
