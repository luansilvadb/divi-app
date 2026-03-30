<template>
  <div class="w-full">
    <!-- Outer container (track) -->
    <div class="h-2.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden relative shadow-inner">
      <!-- Progress indicator (thumb) -->
      <div 
        class="h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full relative"
        :class="[
          { 'animate-pulse-error': isOverBudget || status === 'error' },
          statusClass
        ]"
        :style="customStyle"
      >
        <!-- Shimmer effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-30"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseProgressBar Component
 * Displays a value relative to a maximum.
 */
import { computed } from 'vue'
import type { UIStatus } from '@/shared/types/ui'

const props = withDefaults(defineProps<{
  percentage: number
  color?: string
  status?: UIStatus
  isOverBudget?: boolean
}>(), {
  percentage: 0,
  isOverBudget: false,
  status: 'normal'
})

const statusClass = computed(() => {
  if (props.color) return ''
  switch (props.status) {
    case 'success': return 'bg-success-main'
    case 'error': return 'bg-error-main'
    case 'warning': return 'bg-warning-main'
    case 'info': return 'bg-primary-main'
    default: return 'bg-primary-main'
  }
})

const customStyle = computed(() => ({
  width: `${Math.min(props.percentage, 100)}%`,
  backgroundColor: props.color || undefined
}))
</script>
