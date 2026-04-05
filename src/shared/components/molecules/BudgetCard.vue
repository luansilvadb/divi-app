<template>
  <BaseCard class="budget-card" clickable>
    <template #header>
      <div class="header-content flex justify-between items-center w-full">
        <div class="budget-title-area flex items-center gap-4">
          <BaseIconBox :color="budget.color || 'var(--color-primary-main)'">
            <i class="pi pi-dollar text-xl"></i>
            <i class="pi pi-chart-line text-xl"></i>
          </BaseIconBox>
          <span class="budget-name text-lg font-bold text-text-primary tracking-tight">{{
            budget.name
          }}</span>
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
            class="consumed text-3xl font-extrabold text-text-primary tracking-tighter"
            :class="{ 'text-error-main': isOverBudget }"
            >{{ formatCurrency(consumed) }}</span
          >
          <span class="limit text-base font-medium text-text-secondary"
            >/ {{ formatCurrency(budget.limit_value) }}</span
          >
        </div>
        <div
          class="percentage-pill text-sm font-bold bg-black/5 dark:bg-white/10 text-text-secondary px-2.5 py-1 rounded-lg"
          :class="{ 'over-budget !bg-error-main/10 !text-error-main': isOverBudget }"
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
        class="budget-footer-details flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5"
      >
        <div
          class="cadence flex items-center gap-2 text-sm"
          v-if="daysRemaining > 0 && !isOverBudget"
        >
          <span class="cadence-label text-text-secondary">Sugerido por dia:</span>
          <span
            class="cadence-value font-bold text-text-primary bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md"
          >
            {{ formatCurrency(dailyCadence) }}
          </span>
        </div>
        <div
          class="cadence over-alert flex items-center gap-2 text-sm text-error-main font-semibold"
          v-else-if="isOverBudget"
        >
          <span class="cadence-label">Orçamento estourado</span>
          <i class="pi pi-exclamation-circle text-sm"></i>
        </div>

        <div
          class="days-remaining flex items-center gap-1.5 text-[0.8rem] font-semibold text-text-secondary bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg"
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
