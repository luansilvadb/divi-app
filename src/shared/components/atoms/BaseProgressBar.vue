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
import ProgressBar from 'primevue/progressbar'
import type { UIStatus } from '@/shared/types/ui'

withDefaults(
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

</script>
