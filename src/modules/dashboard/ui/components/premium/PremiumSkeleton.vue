<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'circle' | 'rect'
  width?: string
  height?: string
  lines?: number
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: undefined,
  lines: 1,
  animated: true,
})

const computedHeight = computed(() => {
  if (props.height) return props.height
  if (props.variant === 'text') return '1em'
  if (props.variant === 'circle') return props.width
  return '120px'
})

const lineArray = computed(() => Array.from({ length: props.lines }, (_, i) => i))
</script>

<template>
  <div
    v-if="lines > 1"
    class="premium-skeleton-group"
  >
    <PremiumSkeleton
      v-for="n in lineArray"
      :key="n"
      :variant="variant"
      :width="n === lineArray.length - 1 ? '75%' : width"
      :height="height"
      :animated="animated"
    />
  </div>

  <div
    v-else
    class="premium-skeleton"
    :class="[
      `premium-skeleton--${variant}`,
      { 'premium-skeleton--animated': animated }
    ]"
    :style="{ width, height: computedHeight }"
  >
    <div class="premium-skeleton__shimmer" />
  </div>
</template>

<style scoped>
.premium-skeleton-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.premium-skeleton {
  position: relative;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.premium-skeleton--circle {
  border-radius: 50%;
}

.premium-skeleton--text {
  border-radius: var(--radius-sm);
}

/* Shimmer animation */
.premium-skeleton--animated::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .premium-skeleton--animated::after {
    animation: none;
    transform: translateX(0);
    background: rgba(255, 255, 255, 0.03);
  }
}
</style>
