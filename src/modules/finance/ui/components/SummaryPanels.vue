<template>
  <div class="summary-panels">
    <BaseCard class="summary-card" :style="{ borderLeft: '4px solid #ef4444' }">
      <div class="summary-header">
        <span class="summary-icon">⚠️</span>
        <span class="summary-title">Overdue</span>
      </div>
      <div class="summary-amount overdue">{{ formatCurrency(overdueAmount) }}</div>
      <div class="summary-count">{{ overdueCount }} transactions</div>
    </BaseCard>

    <BaseCard class="summary-card" :style="{ borderLeft: '4px solid #3b82f6' }">
      <div class="summary-header">
        <span class="summary-icon">⏳</span>
        <span class="summary-title">Near Future</span>
      </div>
      <div class="summary-amount future">{{ formatCurrency(futureAmount) }}</div>
      <div class="summary-count">Next 7 days</div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '../../../../shared/components/atoms/BaseCard.vue'

defineProps<{
  overdueAmount: number
  overdueCount: number
  futureAmount: number
}>()

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}
</script>

<style scoped>
.summary-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.summary-card {
  padding: 1.25rem;
}
.summary-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.summary-icon {
  font-size: 1.25rem;
}
.summary-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}
.summary-amount {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.25rem 0;
}
.overdue {
  color: #b91c1c;
}
.future {
  color: #1d4ed8;
}
.summary-count {
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
