<template>
  <div class="budget-progress-bar">
    <BaseProgressBar
      :percentage="clampedPercentage"
      :status="status"
      :is-over-budget="isOverBudget"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import type { UIStatus } from '@/shared/types/ui'

const props = defineProps<{
  spent: number
  limit: number
}>()

const isOverBudget = computed(() => props.spent > props.limit)
const percentage = computed(() => Math.round((props.spent / props.limit) * 100))
const clampedPercentage = computed(() => Math.min(percentage.value, 100))

const status = computed((): UIStatus => {
  if (isOverBudget.value) return 'error'
  if (percentage.value > 90) return 'error'
  if (percentage.value > 50) return 'warning'
  return 'success'
})
</script>
