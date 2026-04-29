<template>
  <button
    @click="toggleTheme"
    class="theme-toggle flex items-center justify-center p-2 rounded-xl transition-all duration-150 ease-out cursor-pointer border-none" :style="{ color: 'var(--text-secondary)', background: 'var(--surface-secondary)' }"
    :aria-label="isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
  >
    <div class="relative w-5 h-5 flex items-center justify-center overflow-hidden">
      <i
        class="i-lucide-sun absolute transition-all duration-500"
        :style="{ transitionTimingFunction: 'var(--ease-spring)' }"
        :class="isDark ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-8 opacity-0 rotate-90'"
      ></i>
      <i
        class="i-lucide-moon absolute transition-all duration-500"
        :style="{ transitionTimingFunction: 'var(--ease-spring)' }"
        :class="!isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 -rotate-90'"
      ></i>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/core/theme'

const { isDark, toggle: toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle:hover .i-lucide-sun,
.theme-toggle:hover .i-lucide-moon {
  filter: brightness(1.2);
}

.theme-toggle:active {
  transform: scale(0.92);
}
</style>
