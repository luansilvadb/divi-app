<template>
  <div
    class="rounded-xl flex items-center justify-center transition-all duration-300"
    :class="[sizeClasses[size], customClasses]"
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
  },
)

const sizeClasses: Record<BoxSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const isCssVar = computed(() => props.color?.startsWith('var('))

const customStyle = computed(() => {
  if (!props.color) return {}
  return {
    backgroundColor: isCssVar.value ? `rgba(${props.color}, 0.1)` : `${props.color}15`,
    color: props.color,
  }
})

const customClasses = computed(() => {
  if (props.color) return ''
  return 'bg-primary/10 text-primary'
})
</script>

