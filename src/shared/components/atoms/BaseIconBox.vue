<template>
  <div
    class="rounded-0 flex items-center justify-center transition-all duration-150 ease-out"
    :class="[sizeClasses[size]]"
    :style="customStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type BoxSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    color?: string
    size?: BoxSize
  }>(),
  {
    size: 'md',
    // Apple System Blue as default
    color: 'var(--color-primary)',
  },
)

const sizeClasses: Record<BoxSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const customStyle = computed(() => {
  return {
    // Using CSS variables for dynamic theming (Light/Dark)
    backgroundColor: `${props.color}15`, // 15 hex = ~8% opacity
    color: props.color,
    border: `1px solid ${props.color}25` // 25 hex = ~15% opacity
  }
})
</script>
