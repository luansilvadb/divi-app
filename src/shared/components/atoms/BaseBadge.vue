<template>
  <Badge
    :value="label"
    :severity="primeSeverity"
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-widest border transition-all duration-300',
      status === 'normal' ? 'bg-primary-main/10 text-primary-main border-primary-main/20' : '',
    ]"
    :style="customStyle"
  >
    <slot>{{ label }}</slot>
  </Badge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from 'primevue/badge'
import type { UIStatus } from '@/shared/types/ui'

type BadgeVariant = 'subtle' | 'outline' | 'solid'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: BadgeVariant
    color?: string
    status?: UIStatus
  }>(),
  {
    variant: 'subtle',
    status: 'normal',
  },
)

const primeSeverity = computed(() => {
  switch (props.status) {
    case 'success': return 'success'
    case 'error': return 'danger'
    case 'warning': return 'warn'
    case 'info': return 'info'
    default: return undefined
  }
})

const isCssVar = computed(() => props.color?.startsWith('var('))

const customStyle = computed(() => {
  if (!props.color) return {}
  const colorValue = props.color

  if (props.variant === 'solid') {
    return { backgroundColor: colorValue, borderColor: colorValue, color: 'white' }
  }
  if (props.variant === 'outline') {
    return { color: colorValue, borderColor: colorValue, backgroundColor: 'transparent' }
  }
  return {
    backgroundColor: isCssVar.value ? `rgba(${props.color}, 0.1)` : `${props.color}15`,
    color: colorValue,
    borderColor: isCssVar.value ? `rgba(${props.color}, 0.2)` : `${props.color}30`,
  }
})
</script>
