<template>
  <div class="w-full">
    <!-- Outer container (track) -->
    <div class="h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden relative shadow-inner">
      <!-- Progress indicator (thumb) -->
      <div 
        class="h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full relative"
        :class="[
          { 'animate-pulse-error': isOverBudget }
        ]"
        :style="{ 
          width: `${Math.min(percentage, 100)}%`,
          backgroundColor: color || 'var(--color-primary-main)'
        }"
      >
        <!-- Shimmer effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseProgressBar Component
 * Displays a value relative to a maximum.
 */
withDefaults(defineProps<{
  percentage: number
  color?: string
  isOverBudget?: boolean
}>(), {
  percentage: 0,
  isOverBudget: false
})
</script>
