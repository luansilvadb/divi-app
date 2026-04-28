<template>
  <div class="w-full">
    <NProgress
      type="line"
      :percentage="percentage"
      :show-indicator="false"
      :status="naiveStatus"
      :color="color"
      :rail-color="isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'"
      :height="10"
      class="!rounded-2px overflow-hidden transition-all duration-150 ease-out"
    />
  </div>
</template>

<script setup lang="ts">
import { NProgress } from 'naive-ui'
import type { UIStatus } from '@/shared/types/ui'
import { computed } from 'vue'
import { useTheme } from '@/core/theme'

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

const { isDark } = useTheme()

const naiveStatus = computed(() => {
  if (props.isOverBudget || props.status === 'error') return 'error'
  if (props.status === 'warning') return 'warning'
  if (props.status === 'success') return 'success'
  return 'info'
})
</script>
