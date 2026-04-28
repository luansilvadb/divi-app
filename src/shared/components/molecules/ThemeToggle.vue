<template>
  <button
    @click="toggleTheme"
    class="flex items-center justify-center p-2 rounded-xl transition-all duration-150 ease-out cursor-pointer border-none" :style="{ color: 'var(--text-secondary)', background: 'var(--surface-secondary)' }"
    :aria-label="isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
  >
    <i
      :class="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
      class="text-lg transition-transform duration-150 ease-out group-hover:rotate-12"
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
