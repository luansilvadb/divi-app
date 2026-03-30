<template>
  <div 
    class="glass-card overflow-hidden transition-all duration-300"
    :class="{ 
      'cursor-pointer hover-glow active:scale-[0.98]': clickable 
    }"
  >
    <!-- Header -->
    <div v-if="$slots.header" class="px-6 py-4 border-b border-black/5 dark:border-white/5 font-bold text-text-primary text-lg tracking-tight">
      <slot name="header" />
    </div>
    
    <!-- Default content -->
    <div class="p-6 text-text-primary">
      <slot />
    </div>
    
    <!-- Footer -->
    <div v-if="$slots.footer" class="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5 text-text-secondary text-sm font-medium">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseCard Component
 * Standard container for content with glassmorphism effect.
 */
defineProps<{
  clickable?: boolean
}>()
</script>
