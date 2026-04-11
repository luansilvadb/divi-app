<template>
  <div
    class="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-2xl h-11 w-full max-w-[280px] overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800"
  >
    <button
      type="button"
      @click="$emit('prev')"
      class="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-violet-500 transition-all duration-300 border-none h-full w-12 flex items-center justify-center shrink-0 cursor-pointer active:scale-90"
      aria-label="Mês anterior"
    >
      <i class="i-lucide-chevron-left text-lg"></i>
    </button>

    <div class="flex-1 flex flex-col items-center justify-center min-w-0 px-2 select-none">
      <span
        class="text-[10px] font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-50 leading-none truncate"
      >
        {{ month }}
      </span>
    </div>

    <button
      type="button"
      @click="$emit('next')"
      class="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-violet-500 transition-all duration-300 border-none h-full w-12 flex items-center justify-center shrink-0 cursor-pointer active:scale-90"
      aria-label="Próximo mês"
    >
      <i class="i-lucide-chevron-right text-lg"></i>
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
