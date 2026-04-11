<template>
  <Badge :value="label" :severity="primeSeverity">
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
    case 'success':
      return 'success'
    case 'error':
      return 'danger'
    case 'warning':
      return 'warn'
    case 'info':
      return 'info'
    default:
      return undefined
  }
})
</script>
