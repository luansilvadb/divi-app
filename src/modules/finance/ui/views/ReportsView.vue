<template>
  <div class="reports-view">
    <header class="view-header">
      <div class="title-section">
        <h1>Relatórios e Análises</h1>
        <p class="subtitle">Entenda para onde vai o seu dinheiro</p>
      </div>
      <div class="report-filters">
        <BaseButton variant="secondary" size="sm">Este Mês</BaseButton>
        <BaseButton variant="secondary" size="sm">Últimos 3 Meses</BaseButton>
        <BaseButton variant="secondary" size="sm">Este Ano</BaseButton>
      </div>
    </header>

    <div class="reports-grid">
      <BaseCard class="chart-section">
        <template #header>Distribuição por Categoria</template>
        <div class="chart-container">
          <!-- Mock for Donut Chart -->
          <div class="donut-chart-mock">
            <div class="donut-inner">
              <span class="total-label">Total Gasto</span>
              <span class="total-value">{{ formatCurrency(totalExpenses) }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <div v-for="cat in categorySummary" :key="cat.name" class="legend-item">
              <span class="dot" :style="{ background: cat.color }"></span>
              <span class="name">{{ cat.name }}</span>
              <span class="percentage">{{ cat.percentage }}%</span>
              <span class="value">{{ formatCurrency(cat.value) }}</span>
            </div>
          </div>
        </div>
      </BaseCard>

      <div class="stats-cards">
        <BaseCard class="stat-card">
          <span class="label">Média Diária</span>
          <h3 class="value">{{ formatCurrency(dailyAverage) }}</h3>
          <span class="trend down">▼ 5% em relação ao mês anterior</span>
        </BaseCard>

        <BaseCard class="stat-card">
          <span class="label">Maior Gasto Único</span>
          <h3 class="value">{{ formatCurrency(maxExpense) }}</h3>
          <span class="subtext">Supermercado em 15/03</span>
        </BaseCard>

        <BaseCard class="stat-card highlight">
          <span class="label">Economia Potencial</span>
          <h3 class="value">{{ formatCurrency(potentialSavings) }}</h3>
          <span class="subtext">Se reduzir lazer em 20%</span>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'

const financeStore = useFinanceStore()
const { transactions } = storeToRefs(financeStore)

const totalExpenses = computed(() => {
  return Math.abs(transactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0))
})

const categorySummary = computed(() => {
  // Mock data for visual representation
  return [
    { name: 'Alimentação', value: 1200, percentage: 40, color: '#ef4444' },
    { name: 'Moradia', value: 900, percentage: 30, color: '#3b82f6' },
    { name: 'Transporte', value: 450, percentage: 15, color: '#f59e0b' },
    { name: 'Lazer', value: 300, percentage: 10, color: '#10b981' },
    { name: 'Outros', value: 150, percentage: 5, color: '#6b7280' }
  ]
})

const dailyAverage = computed(() => totalExpenses.value / 30)
const maxExpense = ref(450.00)
const potentialSavings = ref(340.00)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
</script>

<style scoped>
.reports-view {
  max-width: 1200px;
  margin: 0 auto;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.report-filters {
  display: flex;
  gap: 0.5rem;
}
.reports-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}
.chart-container {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 2rem 0;
}
.donut-chart-mock {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: conic-gradient(
    #ef4444 0% 40%,
    #3b82f6 40% 70%,
    #f59e0b 70% 85%,
    #10b981 85% 95%,
    #6b7280 95% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.donut-inner {
  width: 170px;
  height: 170px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
.total-label {
  font-size: 0.875rem;
  color: #6b7280;
}
.total-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
}
.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.legend-item {
  display: grid;
  grid-template-columns: 16px 1fr 50px 100px;
  align-items: center;
  gap: 1rem;
  font-size: 0.9375rem;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}
.legend-item .name { color: #4b5563; }
.legend-item .percentage { color: #9ca3af; text-align: right; }
.legend-item .value { font-weight: 600; text-align: right; }

.stats-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.stat-card {
  display: flex;
  flex-direction: column;
}
.stat-card .label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}
.stat-card .value {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}
.stat-card .trend {
  font-size: 0.75rem;
  margin-top: 0.5rem;
}
.stat-card .trend.down { color: #10b981; }
.stat-card .subtext {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}
.stat-card.highlight {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

@media (max-width: 1024px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
  .chart-container {
    flex-direction: column;
  }
}
</style>
