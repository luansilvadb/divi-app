<template>
  <div class="settings-page p-6 max-w-5xl mx-auto">
    <header class="mb-8">
      <h1 class="text-4xl font-black text-surface-800 dark:text-surface-50 tracking-tight mb-2">Configurações</h1>
      <p class="text-surface-600 dark:text-surface-200 opacity-60">Personalize sua experiência no Divi.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card class="border-none shadow-lg bg-surface-0/40 dark:bg-surface-800/40 backdrop-blur-md">
        <template #title>Geral</template>
        <template #content>
          <div class="flex flex-col gap-4">
            <p class="text-sm opacity-60">Configurações gerais do sistema em breve.</p>
          </div>
        </template>
      </Card>

      <Card class="border-none shadow-lg bg-surface-0/40 dark:bg-surface-800/40 backdrop-blur-md">
        <template #title>Sincronização</template>
        <template #content>
          <div class="flex flex-col gap-4">
            <p class="text-sm opacity-60">Ajuste a frequência de sincronização e preferências de rede.</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
</script>
