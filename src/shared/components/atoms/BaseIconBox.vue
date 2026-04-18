<template>
  <div
    class="rounded-0 flex items-center justify-center transition-all duration-300"
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
    color: '#B45309',
  },
)

const sizeClasses: Record<BoxSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const customStyle = computed(() => {
  return {
    backgroundColor: `${props.color}15`,
    color: props.color,
    border: `1px solid ${props.color}25`
  }
})
</script>
