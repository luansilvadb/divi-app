<template>
  <div class="flex min-h-screen bg-bg-main text-text-primary">
    <AppSidebar v-if="isLoggedIn" @logout="handleLogout" />
    <main class="flex-1 p-8 overflow-y-auto bg-bg-main">
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
/* Reset global style can stay empty if we used main.css */
</style>
