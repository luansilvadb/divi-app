<template>
  <BaseCard class="budget-card">
    <template #header>
      <div class="header-content">
        <span class="budget-name">{{ budget.name }}</span>
        <BaseBadge :color="budget.color || '#3b82f6'">
          {{ budget.type === 'spending' ? 'Gasto' : 'Reserva' }}
        </BaseBadge>
      </div>
    </template>
    
    <div class="budget-info">
      <div class="values">
        <span class="consumed">{{ formatCurrency(consumed) }}</span>
        <span class="limit">/ {{ formatCurrency(budget.limit_value) }}</span>
      </div>
      
      <div class="progress-bar-container">
        <div 
          class="progress-bar" 
          :style="{ 
            width: `${percentage}%`,
            backgroundColor: isOverBudget ? '#ef4444' : (budget.color || '#3b82f6')
          }"
        ></div>
      </div>
      
      <div class="cadence" v-if="daysRemaining > 0">
        <span class="cadence-label">Sugerido por dia:</span>
        <span class="cadence-value" :class="{ 'negative': isOverBudget }">
          {{ formatCurrency(dailyCadence) }}
        </span>
      </div>
      
      <div class="days-remaining">
        {{ daysRemaining }} dias restantes
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseBadge from '@/shared/components/atoms/BaseBadge.vue'
import type { Budget } from '@/modules/finance/domain/entities'

const props = defineProps<{
  budget: Budget
  consumed: number
}>()

const percentage = computed(() => {
  if (props.budget.limit_value <= 0) return 0
  const p = (props.consumed / props.budget.limit_value) * 100
  return Math.min(p, 100)
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
    currency: 'BRL'
  }).format(value)
}
</script>

<style scoped>
.budget-card {
  margin-bottom: 1rem;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.budget-name {
  font-size: 1.125rem;
  color: #1f2937;
}
.budget-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.values {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}
.consumed {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
.limit {
  font-size: 0.875rem;
  color: #6b7280;
}
.progress-bar-container {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}
.cadence {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}
.cadence-label {
  color: #6b7280;
}
.cadence-value {
  font-weight: 600;
  color: #059669;
}
.cadence-value.negative {
  color: #ef4444;
}
.days-remaining {
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: right;
}
</style>
