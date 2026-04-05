<template>
  <Avatar
    class="flex items-center justify-center transition-all duration-300 !rounded-xl"
    :class="[sizeClasses[size], customClasses]"
    :style="customStyle"
  >
    <slot />
  </Avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Avatar from 'primevue/avatar'

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
  return 'bg-primary-main/10 text-primary-main'
})
</script>
