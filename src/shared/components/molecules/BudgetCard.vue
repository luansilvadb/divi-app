<template>
  <DataCard :hoverable="!noHover" clickable v-bind="$attrs" class="budget-card" :class="{ 'budget-card--no-hover': noHover }">
    <div class="budget-card-inner">
      <!-- Header -->
      <div class="budget-header">
        <!-- Square Rounded Icon -->
        <div
          class="budget-icon"
          :style="{ backgroundColor: categoryColor + '15' }"
        >
          <i :class="categoryIcon" :style="{ color: categoryColor }"></i>
        </div>
        <div class="budget-title-wrapper">
          <div class="budget-title-row">
            <span class="budget-title">{{ budget.name || categoryName }}</span>
            <span v-if="showBadge" class="budget-badge" :class="badgeClass">{{ badgeText }}</span>
          </div>
          <span class="budget-period">{{ periodLabel }}</span>
        </div>
      </div>

      <!-- Values -->
      <div class="budget-values">
        <span class="budget-consumed" :class="{ 'budget-over': isOverBudget }">
          {{ formatCurrency(consumed) }}
        </span>
        <span class="budget-limit">
          <span class="budget-limit-separator">/</span>
          {{ formatCurrency(budget.limit_value) }}
        </span>
      </div>

      <!-- Progress Bar with Percentage -->
      <div class="budget-progress-wrapper">
        <div class="budget-progress-bar">
          <NProgress
            type="line"
            :percentage="Math.min(percentage, 100)"
            :show-indicator="false"
            :color="progressColor"
            :height="6"
            :border-radius="3"
          />
        </div>
        <span class="budget-percentage">{{ Math.round(percentage) }}%</span>
      </div>

      <!-- Footer -->
      <div class="budget-footer">
        <div class="budget-footer-left">
          <div v-if="daysRemaining > 0 && !isOverBudget" class="budget-footer-item">
            <span class="budget-footer-label">SUGESTÃO DIÁRIA</span>
            <span class="budget-footer-value">{{ formatCurrency(dailyCadence) }}</span>
          </div>
          <div v-else-if="isOverBudget" class="budget-footer-item budget-footer-alert">
            <i class="i-lucide-alert-circle"></i>
            <span>Orçamento excedido</span>
          </div>
          <div v-else class="budget-footer-item">
            <span class="budget-footer-label">STATUS</span>
            <span class="budget-footer-value">Período encerrado</span>
          </div>
        </div>

        <div class="budget-footer-right">
          <div class="budget-footer-item budget-footer-item-right">
            <span class="budget-footer-label">RESTANTE</span>
            <span class="budget-footer-value">{{ daysRemaining }} dias</span>
          </div>
        </div>
      </div>
    </div>
  </DataCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NProgress } from 'naive-ui'
import type { Budget } from '@/shared/domain/entities/Budget'
import DataCard from './DataCard.vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'

const props = defineProps<{
  budget: Budget
  consumed: number
  noHover?: boolean
}>()

const transactionStore = useTransactionStore()

const categoryName = computed(() => {
  const cat = transactionStore.categoryMap[props.budget.category_id]
  return cat?.name || 'Categoria'
})

const categoryColor = computed(() => {
  const cat = transactionStore.categoryMap[props.budget.category_id]
  return cat?.color || '#007AFF'
})

const categoryIcon = computed(() => {
  const cat = transactionStore.categoryMap[props.budget.category_id]
  return cat?.icon || 'i-lucide-tag'
})

const periodLabel = computed(() => {
  return props.budget.period === 'monthly' ? 'Mensal' : props.budget.period
})

const percentage = computed(() => {
  const limitValue = Number(props.budget.limit_value)
  if (limitValue <= 0) return 0
  return (props.consumed / limitValue) * 100
})

const isOverBudget = computed(() => props.consumed > Number(props.budget.limit_value))

const statusLevel = computed(() => {
  if (isOverBudget.value) return 'exceeded'
  if (percentage.value >= 76) return 'critical'
  if (percentage.value >= 51) return 'attention'
  return 'healthy'
})

const showBadge = computed(() => {
  return statusLevel.value === 'critical' || statusLevel.value === 'exceeded'
})

const badgeClass = computed(() => {
  if (statusLevel.value === 'exceeded') return 'budget-badge--error'
  if (statusLevel.value === 'critical') return 'budget-badge--warning'
  return ''
})

const badgeText = computed(() => {
  if (statusLevel.value === 'exceeded') return 'Excedido'
  if (statusLevel.value === 'critical') return 'Quase lá'
  return ''
})

const progressColor = computed(() => {
  if (isOverBudget.value) return '#FF3B30'
  if (percentage.value >= 76) return '#FF9500'
  return '#0071E3'
})

const daysRemaining = computed(() => {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const diffTime = lastDayOfMonth.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(diffDays, 0)
})

const dailyCadence = computed(() => {
  if (daysRemaining.value <= 0) return 0
  const limitValue = Number(props.budget.limit_value)
  const remaining = limitValue - props.consumed
  return Math.max(remaining / daysRemaining.value, 0)
})

const formatCurrency = (value: number | bigint) => {
  const val = Number(value) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val)
}
</script>

<style scoped>
.budget-card {
  border-radius: var(--radius-xl);
  background-color: var(--surface-primary) !important;
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.budget-card:hover:not(.budget-card--no-hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.budget-card--no-hover,
.budget-card--no-hover:hover {
  transform: none !important;
  box-shadow: none !important;
}

.budget-card-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
}

/* Header */
.budget-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.budget-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.budget-icon i {
  font-size: 20px;
}

.budget-title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.budget-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.budget-title {
  font-size: 15px;
  font-weight: var(--font-semibold);
  color: var(--text-label);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.budget-badge {
  font-size: 10px;
  font-weight: var(--font-semibold);
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.budget-badge--warning {
  color: var(--color-warning);
  background-color: var(--color-warning-subtle);
  border: 1px solid rgba(255, 149, 0, 0.2);
}

.budget-badge--error {
  color: var(--color-error);
  background-color: var(--color-error-subtle);
  border: 1px solid rgba(255, 59, 48, 0.2);
}

.budget-period {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Values */
.budget-values {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
}

.budget-consumed {
  font-size: 28px;
  font-weight: var(--font-semibold);
  color: var(--text-label);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.budget-consumed.budget-over {
  color: var(--color-error);
}

.budget-limit {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: var(--font-normal);
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.budget-limit-separator {
  margin-right: 2px;
}

/* Progress */
.budget-progress-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.budget-progress-bar {
  flex: 1;
}

.budget-progress-bar :deep(.n-progress-line-fill) {
  transition: width 300ms var(--ease-out) !important;
}

.budget-percentage {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  min-width: 28px;
  text-align: right;
}

/* Footer */
.budget-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--surface-separator);
}

.budget-footer-left {
  display: flex;
  align-items: flex-start;
}

.budget-footer-right {
  display: flex;
  justify-content: flex-end;
}

.budget-footer-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.budget-footer-item-right {
  text-align: right;
  align-items: flex-end;
}

.budget-footer-label {
  font-size: 9px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.budget-footer-value {
  font-size: 12px;
  font-weight: var(--font-semibold);
  color: var(--text-label);
}

.budget-footer-alert {
  flex-direction: row;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-error);
  font-size: 12px;
  font-weight: var(--font-medium);
}

.budget-footer-alert i {
  font-size: 14px;
}
</style>
