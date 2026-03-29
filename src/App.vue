<template>
  <div class="divi-app-container">
    <AppSidebar v-if="isLoggedIn" @logout="handleLogout" />
    <main class="divi-main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { container } from './core/di'
import { useTheme } from './core/theme'
import type { IAuthService, User } from './modules/finance/domain/services/IAuthService'
import AppSidebar from './shared/components/organisms/AppSidebar.vue'

const router = useRouter()
useTheme()
const authService = container.resolve<IAuthService>('IAuthService')
const isLoggedIn = ref(false)
const user = ref<User | null>(null)

onMounted(async () => {
  // Set initial user
  user.value = await authService.getCurrentUser()
  isLoggedIn.value = !!user.value

  // Listen for auth changes
  authService.onAuthStateChange((newUser) => {
    user.value = newUser
    isLoggedIn.value = !!newUser
    
    if (!newUser) {
      router.push({ name: 'login' })
    } else if (router.currentRoute.value.name === 'login') {
      router.push({ name: 'dashboard' })
    }
  })
})

async function handleLogout() {
  await authService.signOut()
  router.push({ name: 'login' })
}
</script>

<style>
:root {
  --bg-color: #f9fafb;
  --text-color: #111827;
  --card-bg: #ffffff;
  --border-color: #e5e7eb;
  --sidebar-bg: #1f2937;
  --sidebar-text: #f3f4f6;
}

.dark {
  --bg-color: #111827;
  --text-color: #f3f4f6;
  --card-bg: #1f2937;
  --border-color: #374151;
  --sidebar-bg: #111827;
  --sidebar-text: #f3f4f6;
}

/* Global resets */
body, html {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.divi-app-container {
  display: flex;
  min-height: 100vh;
}

.divi-main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Base Card overrides for dark theme */
.base-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

/* Remove default link styles */
a {
  color: inherit;
  text-decoration: none;
}
</style>
