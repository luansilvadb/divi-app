<template>
  <NConfigProvider
    :theme="naiveTheme"
    :theme-overrides="naiveThemeOverrides"
    :locale="ptBR"
    :date-locale="datePtBR"
  >
    <!-- Premium Noise Texture Overlay -->
    <div class="noise-overlay" aria-hidden="true"></div>
    <NDialogProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <MainLayout v-if="isLoggedIn && !isLoginRoute" @logout="handleLogout">
            <RouterView />
          </MainLayout>

          <!-- Fallback full-screen for Login and Unauthenticated paths -->
          <div
            v-else
            class="flex h-screen w-screen overflow-hidden" style="background: var(--surface-background); color: var(--text-label);"
          >
            <main class="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
              <RouterView />
            </main>
          </div>
        </NNotificationProvider>
      </NMessageProvider>
    </NDialogProvider>
    <NGlobalStyle />
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { container } from './core/di'
import { useTheme } from './core/theme'
import { vaultDb as db } from '@/infrastructure/storage/VaultDatabase'
import type { IAuthService } from './modules/auth/core/ports/IAuthService'
import { DI_TOKENS } from './core/di-tokens'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NGlobalStyle,
  darkTheme,
  ptBR,
  datePtBR,
} from 'naive-ui'
import { lightThemeOverrides, darkThemeOverrides } from './core/theme/naiveTheme'

import MainLayout from './shared/components/templates/MainLayout.vue'

import { useAuthStore } from './modules/auth/application/authStore'
import { storeToRefs } from 'pinia'
import { SubscriptionProcessor } from './modules/subscriptions/application/services/SubscriptionProcessor'

const router = useRouter()
const route = useRoute()
const { isDark } = useTheme()

const naiveTheme = computed(() => (isDark.value ? darkTheme : null))
const naiveThemeOverrides = computed(() => (isDark.value ? darkThemeOverrides : lightThemeOverrides))



const authService = container.resolve<IAuthService>(DI_TOKENS.IAuthService)
const authStore = useAuthStore()
const { isAuthenticated: isLoggedIn } = storeToRefs(authStore)
const isLoginRoute = computed(() => route.name === 'login')

onMounted(async () => {
  // Initialize Auth Store (handles initial fetch and subscription)
  await authStore.initialize()

  // Initial redirect if not logged in and not on login route
  if (!isLoggedIn.value && !isLoginRoute.value) {
    router.push({ name: 'login' })
  } else if (isLoggedIn.value && authStore.user?.id) {
    SubscriptionProcessor.processPendingSubscriptions(authStore.user.id)
  }

  // Reactive redirect based on auth changes
  authService.onAuthStateChange((newUser) => {
    if (!newUser) {
      router.push({ name: 'login' })
    } else {
      if (isLoginRoute.value) {
        router.push({ name: 'dashboard' })
      }
      if (newUser.id) {
        SubscriptionProcessor.processPendingSubscriptions(newUser.id)
      }
    }
  })
})

async function handleLogout() {
  await authService.signOut()
  await db.clearAllData()
  router.push({ name: 'login' })
}
</script>

<style>
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
