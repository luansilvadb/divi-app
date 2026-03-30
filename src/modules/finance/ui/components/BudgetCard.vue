<template>
  <BaseCard class="budget-card" clickable>
    <template #header>
      <div class="header-content">
        <div class="budget-title-area">
          <BaseIconBox :color="budget.color || 'var(--color-primary-main)'">
            <svg
              v-if="budget.type === 'saving'"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </BaseIconBox>
          <span class="budget-name">{{ budget.name }}</span>
        </div>

        <BaseBadge :color="budget.color || 'var(--color-primary-main)'" variant="subtle">
          {{ budget.type === 'spending' ? 'Gasto' : 'Reserva' }}
        </BaseBadge>
      </div>
    </template>

    <div class="budget-info">
      <div class="values-row">
        <div class="values-main">
          <span class="consumed" :class="{ 'text-error-main': isOverBudget }">{{
            formatCurrency(consumed)
          }}</span>
          <span class="limit">/ {{ formatCurrency(budget.limit_value) }}</span>
        </div>
        <div class="percentage-pill" :class="{ 'over-budget': isOverBudget }">
          {{ Math.round(percentage) }}%
        </div>
      </div>

      <BaseProgressBar
        :percentage="percentage"
        :color="budget.color"
        :is-over-budget="isOverBudget"
      />

      <div class="budget-footer-details">
        <div class="cadence" v-if="daysRemaining > 0 && !isOverBudget">
          <span class="cadence-label">Sugerido por dia:</span>
          <span class="cadence-value">
            {{ formatCurrency(dailyCadence) }}
          </span>
        </div>
        <div class="cadence over-alert" v-else-if="isOverBudget">
          <span class="cadence-label">Orçamento estourado</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <div class="days-remaining">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
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
import type { Budget } from '@/modules/finance/domain/entities'

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

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-title-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.budget-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.budget-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.values-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.values-main {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.consumed {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

.limit {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.percentage-pill {
  font-size: 0.875rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-text-secondary);
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
}

:is(.dark) .percentage-pill {
  background: rgba(255, 255, 255, 0.1);
}

.percentage-pill.over-budget {
  background: rgba(var(--color-error-main-rgb), 0.1);
  color: var(--color-error-main);
}

.text-error-main {
  color: var(--color-error-main) !important;
}

.budget-footer-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 1rem;
}

:is(.dark) .budget-footer-details {
  border-top-color: rgba(255, 255, 255, 0.05);
}

.cadence {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.cadence-label {
  color: var(--color-text-secondary);
}

.cadence-value {
  font-weight: 700;
  color: var(--color-text-primary);
  background: rgba(0, 0, 0, 0.04);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

:is(.dark) .cadence-value {
  background: rgba(255, 255, 255, 0.08);
}

.over-alert {
  color: var(--color-error-main);
  font-weight: 600;
}

.over-alert .cadence-label {
  color: inherit;
}

.days-remaining {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: rgba(0, 0, 0, 0.03);
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
}

:is(.dark) .days-remaining {
  background: rgba(255, 255, 255, 0.05);
}
</style>
