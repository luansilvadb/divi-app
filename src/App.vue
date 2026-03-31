<template>
  <div class="flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary">
    <AppSidebar v-if="isLoggedIn" @logout="handleLogout" />
    <main
      :class="[
        'flex-1 h-full overflow-y-auto overflow-x-hidden relative',
        isLoginRoute ? '' : 'bg-bg-main',
      ]"
    >
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { container } from './core/di'
import { useTheme } from './core/theme'
import { useSidebarStore } from './shared/stores/sidebarStore'
import type { IAuthService } from './modules/auth/domain/contracts/IAuthService'
import type { User } from './modules/auth/domain/entities/User'
import AppSidebar from './shared/components/organisms/AppSidebar.vue'

const router = useRouter()
const route = useRoute()
const sidebarStore = useSidebarStore()
useTheme()

const authService = container.resolve<IAuthService>('IAuthService')
const isLoggedIn = ref(false)
const user = ref<User | null>(null)
const isLoginRoute = computed(() => route.name === 'login')

// Watch for performance mode changes to apply global CSS class
watch(
  () => sidebarStore.isLowPowerMode,
  (isLow) => {
    if (isLow) {
      document.documentElement.classList.add('low-power-mode')
    } else {
      document.documentElement.classList.remove('low-power-mode')
    }
  },
  { immediate: true },
)

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
