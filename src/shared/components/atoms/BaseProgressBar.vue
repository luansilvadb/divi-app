<template>
  <div class="w-full">
    <ProgressBar
      :value="percentage"
      :showValue="false"
      class="h-2.5 rounded-full overflow-hidden bg-black/5 dark:bg-white/5 shadow-inner"

    >
      <template #default>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-30"></div>
      </template>
    </ProgressBar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from 'primevue/progressbar'
import type { UIStatus } from '@/shared/types/ui'

const props = withDefaults(
  defineProps<{
    percentage: number
    color?: string
    status?: UIStatus
    isOverBudget?: boolean
  }>(),
  {
    percentage: 0,
    isOverBudget: false,
    status: 'normal',
  },
)

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
</script>
