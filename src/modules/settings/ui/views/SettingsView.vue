<template>
  <div class="settings-page p-6 max-w-5xl mx-auto">
    <header class="mb-8">
      <h1 class="text-4xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight mb-2">
        Configurações
      </h1>
      <p class="text-zinc-500 dark:text-zinc-400 opacity-60">
        Personalize sua experiência no Divi.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseCard class="!bg-white/50 dark:!bg-zinc-900/50 backdrop-blur-md">
        <template #header>Geral</template>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-zinc-500 dark:text-zinc-400 opacity-60">Configurações gerais do sistema em breve.</p>
        </div>
      </BaseCard>

      <BaseCard class="!bg-white/50 dark:!bg-zinc-900/50 backdrop-blur-md">
        <template #header>Sincronização</template>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-zinc-500 dark:text-zinc-400 opacity-60">
            Ajuste a frequência de sincronização e preferências de rede.
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
</script>
