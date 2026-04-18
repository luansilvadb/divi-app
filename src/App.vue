<template>
  <NConfigProvider
    :theme="naiveTheme"
    :theme-overrides="naiveThemeOverrides"
    :locale="ptBR"
    :date-locale="datePtBR"
  >
    <NDialogProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <PWAUpdatePrompt />

          <MainLayout v-if="isLoggedIn && !isLoginRoute" @logout="handleLogout">
            <RouterView />
          </MainLayout>

          <!-- Fallback full-screen for Login and Unauthenticated paths -->
          <div
            v-else
            class="flex h-screen w-screen overflow-hidden bg-obsidian text-slate-100"
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
import type { IAuthService } from './modules/auth/domain/contracts/IAuthService'
import type { IVaultCryptoManager } from './modules/auth/domain/contracts/IVaultCryptoManager'
import type { ISyncEngine } from './core/sync/contracts/ISyncEngine'
import { DI_TOKENS } from './core/di-tokens'
import PWAUpdatePrompt from './shared/components/PWAUpdatePrompt.vue'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NGlobalStyle,
  NButton,
  NCard,
  NSpace,
  NText,
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



const authService = container.resolve<IAuthService>(DI_TOKENS.AuthService)
const vaultCryptoManager = container.resolve<IVaultCryptoManager>(DI_TOKENS.VaultCryptoManager)
const syncEngine = container.resolve<ISyncEngine>(DI_TOKENS.SyncEngine)
const authStore = useAuthStore()
const { isAuthenticated: isLoggedIn } = storeToRefs(authStore)
const isLoginRoute = computed(() => route.name === 'login')

onMounted(async () => {
  // Initialize Auth Store (handles initial fetch and subscription)
  await authStore.initialize(authService, vaultCryptoManager, syncEngine)

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

</style>
