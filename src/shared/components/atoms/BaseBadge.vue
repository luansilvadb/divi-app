<template>
  <NTag
    :type="naiveType"
    :bordered="variant === 'outline'"
    :round="true"
    class="!font-semibold !px-3 transition-all duration-150 ease-out"
    size="small"
  >
    <slot>{{ label }}</slot>
  </NTag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTag } from 'naive-ui'
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

const naiveType = computed(() => {
  switch (props.status) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'default'
  }
})
</script>
