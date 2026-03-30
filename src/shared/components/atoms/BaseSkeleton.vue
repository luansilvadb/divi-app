<template>
  <div
    class="relative overflow-hidden bg-black/5 dark:bg-white/5 animate-pulse"
    :class="[rounded ? 'rounded-full' : 'rounded-lg', customClass]"
    :style="customStyle"
  >
    <!-- Shimmer effect overlay -->
    <div class="absolute inset-0 animate-shimmer"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseSkeleton Component
 * Reusable skeleton loader with shimmer effect (FR-010).
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    rounded?: boolean
    customClass?: string
  }>(),
  {
    width: '100%',
    height: '20px',
    rounded: false,
  },
)

const customStyle = computed(() => ({
  width: props.width,
  height: props.height,
}))
</script>

<style scoped>
/* Shimmer animation already defined in main.css */
</style>
