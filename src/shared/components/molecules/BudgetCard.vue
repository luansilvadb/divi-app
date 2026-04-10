<template>
  <BaseCard class="budget-card" clickable>
    <template #header>
      <div class="header-content flex justify-between items-center w-full">
        <div class="budget-title-area flex items-center gap-4">
          <BaseIconBox :color="budget.color || 'var(--color-primary-main)'">
            <i class="pi pi-dollar text-xl"></i>
            <i class="pi pi-chart-line text-xl"></i>
          </BaseIconBox>
          <span class="budget-name text-lg font-bold text-surface-800 dark:text-surface-50 tracking-tight">{{
            budget.name
          }}</span>
          <ItemSyncIndicator :status="budget.sync_status" />
        </div>

        <BaseBadge :color="budget.color || 'var(--color-primary-main)'" variant="subtle">
          {{ budget.type === 'spending' ? 'Gasto' : 'Reserva' }}
        </BaseBadge>
      </div>
    </template>

    <div class="budget-info flex flex-col gap-5 pt-2">
      <div class="values-row flex justify-between items-end">
        <div class="values-main flex items-baseline gap-1.5">
          <span
            class="consumed text-3xl font-extrabold text-surface-800 dark:text-surface-50 tracking-tighter"
            :class="{ 'text-error': isOverBudget }"
            >{{ formatCurrency(consumed) }}</span
          >
          <span class="limit text-base font-medium text-surface-600 dark:text-surface-200"
            >/ {{ formatCurrency(budget.limit_value) }}</span
          >
        </div>
        <div
          class="percentage-pill text-sm font-bold bg-surface-50 dark:bg-white/10 text-surface-600 dark:text-surface-200 px-2.5 py-1 rounded-lg"
          :class="{ 'over-budget !bg-error/10 !text-error': isOverBudget }"
        >
          {{ Math.round(percentage) }}%
        </div>
      </div>

      <BaseProgressBar
        :percentage="percentage"
        :color="budget.color"
        :is-over-budget="isOverBudget"
      />

      <div
        class="budget-footer-details flex justify-between items-center pt-4 border-t border-surface-200 dark:border-surface-200/10"
      >
        <div
          class="cadence flex items-center gap-2 text-sm"
          v-if="daysRemaining > 0 && !isOverBudget"
        >
          <span class="cadence-label text-surface-600 dark:text-surface-200">Sugerido por dia:</span>
          <span
            class="cadence-value font-bold text-surface-800 dark:text-surface-50 bg-surface-50 dark:bg-white/10 px-2 py-0.5 rounded-md"
          >
            {{ formatCurrency(dailyCadence) }}
          </span>
        </div>
        <div
          class="cadence over-alert flex items-center gap-2 text-sm text-error font-semibold"
          v-else-if="isOverBudget"
        >
          <span class="cadence-label">Orçamento estourado</span>
          <i class="pi pi-exclamation-circle text-sm"></i>
        </div>

        <div
          class="days-remaining flex items-center gap-1.5 text-[0.8rem] font-semibold text-surface-600 dark:text-surface-200 bg-surface-50 dark:bg-surface-800/10 px-2.5 py-1 rounded-lg"
        >
          <i class="pi pi-clock text-sm"></i>
          {{ daysRemaining }} dias
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseBadge from '@/shared/components/atoms/BaseBadge.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import type { Budget } from '../../domain/entities/Budget'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'

const props = defineProps<{
  budget: Budget
  consumed: number
}>()

const percentage = computed(() => {
  if (props.budget.limit_value <= 0) return 0
  return (props.consumed / props.budget.limit_value) * 100
})

const isOverBudget = computed(() => props.consumed > props.budget.limit_value)

const daysRemaining = computed(() => {
  const now = new Date()
  const end = new Date(props.budget.period_end)
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(diffDays, 0)
})

const dailyCadence = computed(() => {
  if (daysRemaining.value <= 0) return 0
  const remaining = props.budget.limit_value - props.consumed
  return Math.max(remaining / daysRemaining.value, 0)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
</script>


