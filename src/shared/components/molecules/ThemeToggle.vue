<template>
  <button
    @click="toggleTheme"
    class="theme-toggle flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer text-surface-600 dark:text-surface-200 hover:text-surface-800 dark:text-surface-50 hover:bg-surface-50 dark:hover:bg-surface-800/10"
    :aria-label="isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
    :title="isDark ? 'Tema Claro' : 'Tema Escuro'"
  >
    <span
      :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"
      class="w-5 h-5 flex items-center justify-center text-lg transition-transform duration-300"
    ></span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/core/theme'

const { isDark, toggle: toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle:hover span {
  transform: scale(1.1);
}
</style>
