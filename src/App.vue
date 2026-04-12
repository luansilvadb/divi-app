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
          <!-- PWA Update Toast -->
          <Transition name="slide-up">
            <NCard
              v-if="needRefresh"
              class="fixed bottom-6 right-6 z-[9999] max-w-sm !rounded-2xl shadow-2xl"
              size="small"
            >
              <NSpace align="start" :size="12">
                <div class="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                  <i class="i-lucide-sparkles text-violet-500 text-lg animate-pulse"></i>
                </div>
                <NSpace vertical :size="4">
                  <NText strong class="text-sm">Nova versão disponível!</NText>
                  <NText depth="3" class="text-xs leading-relaxed">
                    Atualizamos o Divi com novas melhorias. Deseja atualizar agora?
                  </NText>
                </NSpace>
              </NSpace>
              <template #action>
                <NSpace :size="8">
                  <NButton type="primary" size="small" round @click="updateServiceWorker(true)">
                    Atualizar Agora
                  </NButton>
                  <NButton quaternary size="small" @click="closeUpdateToast">Depois</NButton>
                </NSpace>
              </template>
            </NCard>
          </Transition>

          <MainLayout v-if="isLoggedIn && !isLoginRoute" @logout="handleLogout">
            <RouterView />
          </MainLayout>

          <!-- Fallback full-screen for Login and Unauthenticated paths -->
          <div
            v-else
            class="flex h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-50"
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
import { db } from './core/db'
import type { IAuthService } from './modules/auth/domain/contracts/IAuthService'
import { useRegisterSW } from 'virtual:pwa-register/vue'
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

// PWA Logic
const { needRefresh, updateServiceWorker } = useRegisterSW()

const closeUpdateToast = () => {
  needRefresh.value = false
}

const authService = container.resolve<IAuthService>('IAuthService')
const authStore = useAuthStore()
const { isAuthenticated: isLoggedIn } = storeToRefs(authStore)
const isLoginRoute = computed(() => route.name === 'login')

onMounted(async () => {
  // Initialize Auth Store (handles initial fetch and subscription)
  await authStore.initialize(authService)

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
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
