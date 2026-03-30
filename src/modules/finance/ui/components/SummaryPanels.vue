<template>
  <div class="summary-panels">
    <div class="summary-item overdue glass-card">
      <div class="summary-indicator"></div>
      <div class="summary-content">
        <header class="summary-header">
          <div class="summary-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <span class="summary-title">Vencidos</span>
        </header>
        <div class="summary-body">
          <h4 class="summary-amount">{{ formatCurrency(overdueAmount) }}</h4>
          <span class="summary-detail">{{ overdueCount }} transações atrasadas</span>
        </div>
      </div>
    </div>

    <div class="summary-item pending glass-card">
      <div class="summary-indicator"></div>
      <div class="summary-content">
        <header class="summary-header">
          <div class="summary-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span class="summary-title">Próximos</span>
        </header>
        <div class="summary-body">
          <h4 class="summary-amount">{{ formatCurrency(futureAmount) }}</h4>
          <span class="summary-detail">Próximos 7 dias</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.summary-item {
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: 1rem;
  transition: transform 0.2s ease;
}

.summary-item:hover {
  transform: scale(1.02);
}

.summary-indicator {
  width: 4px;
  height: 100%;
}

.overdue .summary-indicator { background: var(--color-error-main); }
.pending .summary-indicator { background: var(--color-info-main); }

.summary-content {
  flex: 1;
  padding: 1.25rem;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.summary-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
}

.overdue .summary-icon-box { background: rgba(239, 68, 68, 0.1); color: var(--color-error-main); }
.pending .summary-icon-box { background: rgba(59, 130, 246, 0.1); color: var(--color-info-main); }

.summary-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.summary-amount {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-text-primary);
}

.summary-detail {
  font-size: 0.75rem;
  color: var(--color-text-disabled);
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

:is(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}
</style>
