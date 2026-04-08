<template>
  <!-- PWA Update Toast -->
  <Transition name="slide-up">
    <div 
      v-if="needRefresh" 
      class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 p-5 rounded-2xl bg-surface-main/80 backdrop-blur-xl border border-white/10 shadow-2xl max-w-sm"
    >
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-main/20 flex items-center justify-center">
          <i class="pi pi-sparkles text-primary-main text-xl animate-pulse"></i>
        </div>
        <div>
          <h3 class="font-bold text-text-primary text-sm mb-1">Nova versão disponível!</h3>
          <p class="text-xs text-text-secondary opacity-70 leading-relaxed">
            Atualizamos o Divi com novas melhorias. Deseja atualizar agora para aproveitar as novidades?
          </p>
        </div>
      </div>
      <div class="flex gap-2 mt-2">
        <Button 
          label="Atualizar Agora" 
          icon="pi pi-refresh" 
          size="small"
          class="flex-1 rounded-xl"
          @click="updateServiceWorker(true)"
        />
        <Button 
          label="Depois" 
          text
          size="small"
          severity="secondary"
          class="rounded-xl px-4"
          @click="closeUpdateToast"
        />
      </div>
    </div>
  </Transition>

  <MainLayout v-if="isLoggedIn && !isLoginRoute" @logout="handleLogout">
    <RouterView />
  </MainLayout>

  <!-- Fallback full-screen for Login and Unauthenticated paths -->
  <div v-else class="flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary">
    <main class="flex-1 h-full overflow-y-auto overflow-x-hidden relative bg-bg-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { container } from './core/di'
import { useTheme } from './core/theme'
import type { IAuthService } from './modules/auth/domain/contracts/IAuthService'
import type { User } from './modules/auth/domain/entities/User'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import Button from 'primevue/button'

import MainLayout from './shared/components/templates/MainLayout.vue'

const router = useRouter()
const route = useRoute()
useTheme()

// PWA Logic
const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const closeUpdateToast = () => {
  needRefresh.value = false
}

const authService = container.resolve<IAuthService>('IAuthService')
const isLoggedIn = ref(false)
const user = ref<User | null>(null)
const isLoginRoute = computed(() => route.name === 'login')



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
