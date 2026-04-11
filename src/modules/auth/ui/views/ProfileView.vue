<script setup lang="ts">
import { useAuthStore } from '../../application/authStore'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'

const authStore = useAuthStore()
</script>

<template>
  <div class="profile-page p-6 max-w-5xl mx-auto">
    <header class="mb-8">
      <h1 class="text-4xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight mb-2">
        Meu Perfil
      </h1>
      <p class="text-zinc-500 dark:text-zinc-400 opacity-60">
        Gerencie as informações da sua conta.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- User Info Card -->
      <BaseCard class="md:col-span-1 !bg-white/50 dark:!bg-zinc-900/50 backdrop-blur-md">
        <div class="flex flex-col items-center text-center py-6">
          <div
            class="w-24 h-24 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 border-4 border-violet-500/5"
          >
            <span class="text-3xl font-black text-violet-500">
              {{ authStore.user?.email?.charAt(0).toUpperCase() || 'U' }}
            </span>
          </div>
          <h2 class="text-xl font-bold text-zinc-800 dark:text-zinc-50">
            {{ authStore.user?.email?.split('@')[0] || 'Usuário' }}
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 opacity-60">
            {{ authStore.user?.email }}
          </p>
        </div>
      </BaseCard>

      <div class="md:col-span-2">
      </div>
    </div>
  </div>
</template>
