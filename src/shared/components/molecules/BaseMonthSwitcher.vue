<template>
  <div
    class="flex items-center !bg-[#161D2C] rounded-2xl h-11 w-full max-w-[280px] overflow-hidden shadow-xl border border-white/5"
  >
    <button
      type="button"
      @click="$emit('prev')"
      class="p-2 hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all duration-300 border-none h-full w-12 flex items-center justify-center shrink-0 cursor-pointer active:scale-90"
      aria-label="Mês anterior"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="flex-1 flex flex-col items-center justify-center min-w-0 px-2 select-none group">
      <span
        class="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-primary leading-none truncate"
      >
        {{ month }}
      </span>
    </div>

    <button
      type="button"
      @click="$emit('next')"
      class="p-2 hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all duration-300 border-none h-full w-12 flex items-center justify-center shrink-0 cursor-pointer active:scale-90"
      aria-label="Próximo mês"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseMonthSwitcher
 * Reusable component for month/period navigation following the project's design system.
 */
defineProps<{
  month: string
}>()

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>
