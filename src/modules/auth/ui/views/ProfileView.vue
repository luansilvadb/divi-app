<script setup lang="ts">
import { useAuthStore } from '../../application/authStore'
import Card from 'primevue/card'

const authStore = useAuthStore()
</script>

<template>
  <div class="profile-page p-6 max-w-5xl mx-auto">
    <header class="mb-8">
      <h1 class="text-4xl font-black text-text-primary tracking-tight mb-2">Meu Perfil</h1>
      <p class="text-text-secondary opacity-60">Gerencie as informações da sua conta.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- User Info Card -->
      <Card class="md:col-span-1 overflow-hidden border-none shadow-xl bg-surface-main/50 backdrop-blur-md">
        <template #content>
          <div class="flex flex-col items-center text-center py-6">
            <div class="w-24 h-24 rounded-full bg-primary-main/20 flex items-center justify-center mb-4 border-4 border-primary-main/10">
              <span class="text-3xl font-black text-primary-main">
                {{ authStore.user?.email?.[0].toUpperCase() || 'U' }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-text-primary">{{ authStore.user?.email?.split('@')[0] || 'Usuário' }}</h2>
            <p class="text-sm text-text-secondary opacity-60">{{ authStore.user?.email }}</p>
          </div>
        </template>
      </Card>

      <!-- Espaço para futuras configurações de conta -->
      <div class="md:col-span-2">
        <!-- Placeholder para outras seções -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page :deep(.p-card-body) {
  padding: 1.5rem;
}
</style>
