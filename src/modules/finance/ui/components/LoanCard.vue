<template>
  <div class="glass-card loan-card">
    <div class="card-top">
      <div class="loan-identity">
        <div class="loan-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        </div>
        <div>
          <h3 class="loan-name">{{ loan.name }}</h3>
          <span class="loan-due">Vence: {{ formatDate(loan.due_date) }}</span>
        </div>
      </div>
    </div>

    <div class="loan-metrics">
      <div class="metric">
        <span class="label">Saldo Devedor</span>
        <span class="value emphasis">{{ formatCurrency(loan.remaining_value) }}</span>
      </div>
      <div class="metric">
        <span class="label">Taxa</span>
        <span class="value badge">{{ loan.interest_rate || '0' }}% a.m.</span>
      </div>
    </div>

    <div class="loan-progress-section">
      <div class="progress-info">
        <span>{{ getProgress(loan).toFixed(1) }}% pago</span>
        <span>de {{ formatCurrency(loan.total_value) }}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: getProgress(loan) + '%' }"></div>
      </div>
    </div>

    <div class="card-footer">
      <div class="card-actions">
        <button class="action-btn text-danger" @click="$emit('delete', loan.id)">Remover</button>
        <button class="action-btn text-primary">Registrar Parcela</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Loan } from '@/modules/finance/domain/entities'

defineProps<{
  loan: Loan
}>()

defineEmits<{
  (e: 'delete', id: string): void
}>()

const getProgress = (loan: Loan) => {
  if (loan.total_value === 0) return 0
  const paid = loan.total_value - loan.remaining_value
  return (paid / loan.total_value) * 100
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.loan-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
  animation: card-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--anim-delay, 0s);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1.25rem;
  box-shadow:
    0 4px 20px -2px rgba(0, 0, 0, 0.05),
    0 12px 32px -8px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

:is(.dark) .loan-card {
  background: rgba(22, 27, 34, 0.65);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 20px -2px rgba(0, 0, 0, 0.4),
    0 12px 32px -8px rgba(0, 0, 0, 0.3);
}

@keyframes card-enter {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.loan-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px -10px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(var(--color-primary-main), 0.1);
}

:is(.dark) .loan-card:hover {
  box-shadow: 
    0 12px 40px -10px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(var(--color-primary-main), 0.3);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.loan-identity {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.loan-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-surface-main);
  border: 1px solid var(--color-border-main);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary-main);
}

.loan-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
}

.loan-due {
  font-size: 0.8rem;
  color: var(--color-text-disabled);
}

.loan-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.02);
  padding: 1rem;
  border-radius: 0.75rem;
}

:is(.dark) .loan-metrics {
  background: rgba(255, 255, 255, 0.02);
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric .label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-disabled);
}

.metric .value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.metric .value.emphasis {
  font-size: 1.125rem;
  color: var(--color-error-main);
}

.metric .badge {
  display: inline-flex;
  width: fit-content;
  padding: 0.125rem 0.5rem;
  background: rgba(var(--color-primary-main), 0.1);
  color: var(--color-primary-main);
  border-radius: 999px;
  font-size: 0.8rem;
}

:is(.dark) .metric .badge {
  color: var(--color-text-primary);
  background: rgba(var(--color-primary-main), 0.3);
}

.loan-progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.progress-track {
  height: 8px;
  background: var(--color-border-main);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-main), var(--color-secondary-main));
  border-radius: 999px;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-footer {
  border-top: 1px solid var(--color-border-main);
  padding-top: 1rem;
  margin-top: 0.25rem;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-btn {
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.text-danger {
  color: var(--color-error-main, #ef4444);
}
.text-danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.text-primary {
  color: var(--color-primary-main);
}
.text-primary:hover {
  background: color-mix(in srgb, var(--color-primary-main) 10%, transparent);
}
</style>
