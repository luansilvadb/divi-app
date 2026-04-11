<template>
  <button
    @click="toggleTheme"
    class="theme-toggle flex items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer text-zinc-500 hover:text-violet-500 bg-zinc-100 dark:bg-zinc-800 border-none"
    :aria-label="isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
  >
    <i
      :class="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
      class="text-lg transition-transform duration-300 group-hover:rotate-12"
    ></i>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/core/theme'

const { isDark, toggle: toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle:hover i {
  transform: scale(1.1) rotate(12deg);
}
</style>
