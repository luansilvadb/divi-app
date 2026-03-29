<template>
  <div 
    class="bg-surface-main border border-border-main rounded-lg overflow-hidden transition-all duration-200"
    :class="{ 
      'cursor-pointer hover:-translate-y-1 hover:shadow-lg': clickable 
    }"
  >
    <div v-if="$slots.header" class="px-6 py-4 border-b border-border-main font-bold text-text-primary">
      <slot name="header" />
    </div>
    <div class="p-6 text-text-primary">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-3 bg-bg-main border-t border-border-main text-text-secondary">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  clickable?: boolean
}>()
</script>

<style scoped>
/* Scoped styles removed in favor of Tailwind */
</style>
