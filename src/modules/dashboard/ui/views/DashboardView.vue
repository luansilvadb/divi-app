<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <button class="px-4 py-2 bg-blue-500 text-white rounded" @click="isSheetOpen = true">
      Open Bottom Sheet
    </button>

    <BottomSheet
      v-model="isSheetOpen"
      :duration="300"
      ariaLabelledBy="sheet-title"
    >
      <template #header>
        <h2 id="sheet-title" class="text-lg font-bold text-center w-full">Detalhes da Transação</h2>
      </template>
      <div class="p-4">
        <p class="mb-4">Este é um exemplo de conteúdo dentro do bottom sheet. Ele suporta drag, snap e acessibilidade.</p>
        <button class="px-4 py-2 bg-red-500 text-white rounded w-full" @click="isSheetOpen = false">
          Fechar
        </button>
        <div class="h-64 mt-4 bg-gray-100 dark:bg-gray-800 rounded p-4 flex items-center justify-center">
          Área de Scroll para testar drag
        </div>
        <div class="h-64 mt-4 bg-gray-100 dark:bg-gray-800 rounded p-4 flex items-center justify-center">
          Área de Scroll 2
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomSheet from '@/shared/components/BottomSheet.vue'

const isSheetOpen = ref(false)
</script>
