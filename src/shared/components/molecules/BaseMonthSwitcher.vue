<template>
  <div
    class="flex items-center bg-surface-secondary rounded-xl h-11 w-full max-w-[280px] overflow-hidden border border-separator"
  >
    <button
      type="button"
      @click="$emit('prev')"
      class="p-2 hover:bg-surface-tertiary transition-colors duration-normal border-none h-full w-12 flex items-center justify-center shrink-0 cursor-pointer active:scale-90"
      aria-label="Mês anterior"
    >
      <i class="i-lucide-chevron-left text-lg text-secondary"></i>
    </button>

    <div class="flex-1 flex flex-col items-center justify-center min-w-0 px-2 select-none">
      <span
        class="text-[10px] font-bold uppercase tracking-widest text-label leading-none truncate"
      >
        {{ month }}
      </span>
    </div>

    <button
      type="button"
      @click="$emit('next')"
      class="p-2 hover:bg-surface-tertiary transition-colors duration-normal border-none h-full w-12 flex items-center justify-center shrink-0 cursor-pointer active:scale-90"
      aria-label="Próximo mês"
    >
      <i class="i-lucide-chevron-right text-lg text-secondary"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  month: string
}>()

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>
