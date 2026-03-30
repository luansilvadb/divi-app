<template>
  <div class="reports-view animate-fade-in">
    <!-- Background Decor -->
    <div class="reports-bg-decor" aria-hidden="true">
      <div class="glass-orb orb-1"></div>
      <div class="glass-orb orb-2"></div>
    </div>

    <!-- Header Section -->
    <header class="reports-header">
      <div class="header-content">
        <h1 class="page-title">
          Relatórios e <span class="text-accent-main">Análises</span>
        </h1>
        <p class="page-subtitle">Entenda para onde vai o seu dinheiro com insights detalhados.</p>
      </div>
      <div class="report-filters">
        <button 
          v-for="filter in ['Este Mês', 'Últimos 3 Meses', 'Este Ano']" 
          :key="filter"
          :class="['filter-btn', { active: activeFilter === filter }]"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
    </header>

    <div class="reports-content-grid">
      <!-- Main Column: Charts -->
      <div class="main-column">
        <BaseCard class="chart-section glass-card">
          <template #header>
            <div class="card-header-flex">
              <span class="card-title">Distribuição por Categoria</span>
              <button class="icon-btn" aria-label="Mais opções">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
            </div>
          </template>
          
          <div class="chart-container">
            <!-- Polished Donut Chart Mock -->
            <div class="donut-chart-mock">
              <div class="donut-ring" :style="{ background: donutGradient }"></div>
              <div class="donut-inner">
                <span class="total-label">Gasto Total</span>
                <span class="total-value text-error-main">{{ formatCurrency(totalExpenses) }}</span>
              </div>
            </div>
            
            <div class="chart-legend">
              <div v-for="(cat, index) in categorySummary" :key="cat.name" 
                   class="legend-item" 
                   :style="{ animationDelay: `${index * 100}ms` }">
                <div class="legend-info">
                  <span class="dot" :style="{ background: cat.color, boxShadow: `0 0 10px opacity(0.5)` }"></span>
                  <span class="name">{{ cat.name }}</span>
                </div>
                <div class="legend-stats">
                  <span class="percentage">{{ cat.percentage }}%</span>
                  <span class="value">{{ formatCurrency(cat.value) }}</span>
                </div>
                <div class="progress-bg">
                  <div class="progress-bar" :style="{ width: `${cat.percentage}%`, background: cat.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Monthly Comparison or Cash Flow Placeholder -->
        <BaseCard class="flow-section glass-card mt-6">
          <template #header>
            <div class="card-header-flex">
              <span class="card-title">Fluxo de Caixa Mensal</span>
            </div>
          </template>
          <div class="flow-placeholder">
            <div class="bars">
              <!-- Animated Placeholder Bars -->
              <div class="bar-group" v-for="(item, i) in flowData" :key="i" :style="{ animationDelay: `${i * 100}ms` }">
                <div class="bar income" :style="{ height: `${item.income}%` }"></div>
                <div class="bar expense" :style="{ height: `${item.expense}%` }"></div>
                <span class="bar-label">{{ item.label }}</span>
              </div>
            </div>
            <div class="flow-legend">
              <div class="legend-pill">
                <span class="pill-dot income"></span> Entradas
              </div>
              <div class="legend-pill">
                <span class="pill-dot expense"></span> Saídas
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Right Column: Stats Cards -->
      <aside class="side-column">
        <BaseCard class="stat-card glass-card hover-glow">
          <div class="stat-header">
            <div class="stat-icon-wrapper info-glow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </div>
            <span class="stat-label">Média Diária</span>
          </div>
          <div class="stat-body">
            <h3 class="stat-value">{{ formatCurrency(dailyAverage) }}</h3>
            <div class="stat-trend success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
                <path d="M17 6h6v6"></path>
              </svg>
              <span>5% menor que o mês anterior</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="stat-card glass-card hover-glow">
          <div class="stat-header">
            <div class="stat-icon-wrapper warning-glow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <span class="stat-label">Maior Gasto Único</span>
          </div>
          <div class="stat-body">
            <h3 class="stat-value">{{ formatCurrency(maxExpense) }}</h3>
            <p class="stat-subtext">Supermercado em 15/03</p>
          </div>
        </BaseCard>

        <BaseCard class="stat-card highlight-card hover-glow">
          <div class="stat-header">
            <div class="stat-icon-wrapper success-glow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <span class="stat-label">Economia Potencial</span>
          </div>
          <div class="stat-body">
            <h3 class="stat-value text-success-main">{{ formatCurrency(potentialSavings) }}</h3>
            <p class="stat-subtext">Se reduzir lazer em 20%</p>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'

const financeStore = useFinanceStore()
const { transactions } = storeToRefs(financeStore)

const activeFilter = ref('Este Mês')

const totalExpenses = computed(() => {
  const sum = transactions.value
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  return sum > 0 ? Math.abs(sum) : 3450.00 // Default view logic fallback
})

const categorySummary = computed(() => {
  return [
    { name: 'Moradia', value: 1380, percentage: 40, color: 'var(--color-primary-main)' },
    { name: 'Alimentação', value: 1035, percentage: 30, color: 'var(--color-secondary-main)' },
    { name: 'Transporte', value: 517.5, percentage: 15, color: 'var(--color-accent-main)' },
    { name: 'Lazer', value: 345, percentage: 10, color: '#f59e0b' },
    { name: 'Outros', value: 172.5, percentage: 5, color: '#6b7280' }
  ]
})

const donutGradient = computed(() => {
  let gradientStr = 'conic-gradient('
  let currentPercentage = 0
  categorySummary.value.forEach((cat, index) => {
    const start = currentPercentage
    const end = currentPercentage + cat.percentage
    gradientStr += `${cat.color} ${start}% ${end}%${index < categorySummary.value.length - 1 ? ',' : ''}`
    currentPercentage = end
  })
  gradientStr += ')'
  return gradientStr
})

// Mock data for the flow chart
const flowData = [
  { label: 'Out', income: 60, expense: 45 },
  { label: 'Nov', income: 65, expense: 50 },
  { label: 'Dez', income: 80, expense: 75 },
  { label: 'Jan', income: 55, expense: 60 },
  { label: 'Fev', income: 70, expense: 40 },
  { label: 'Mar', income: 65, expense: 35 }
]

const dailyAverage = computed(() => totalExpenses.value / 30)
const maxExpense = ref(450.00)
const potentialSavings = ref(340.00)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
</script>

<style scoped>
.reports-view {
  width: 100%;
  padding: 2rem 2.5rem;
  position: relative;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: calc(100vh - 80px); /* Fill space smoothly */
}

/* ===== Background Decorations ===== */
.reports-bg-decor {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  will-change: transform;
}

:is(.dark) .glass-orb {
  opacity: 0.2;
}

.orb-1 {
  width: 450px;
  height: 450px;
  background: var(--color-primary-main);
  top: -100px;
  left: -100px;
  animation: float 15s ease-in-out infinite;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: var(--color-accent-main);
  bottom: -50px;
  right: -50px;
  animation: float 18s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(30px) scale(1.05); }
}

/* ===== Header Styles ===== */
.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.05rem;
  margin: 0;
}

.text-accent-main {
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== Filter Buttons ===== */
.report-filters {
  display: flex;
  background: color-mix(in srgb, var(--color-surface-main) 60%, transparent);
  backdrop-filter: blur(16px);
  border: 1px solid var(--color-border-main);
  border-radius: 999px;
  padding: 0.35rem;
  gap: 0.25rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.filter-btn {
  background: transparent;
  border: none;
  border-radius: 999px;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.filter-btn:hover:not(.active) {
  color: var(--color-text-primary);
  background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
}

.filter-btn.active {
  background: var(--color-primary-main);
  color: white;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-main) 30%, transparent);
}

/* ===== Layout Grid ===== */
.reports-content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  width: 100%;
}

.main-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

/* ===== Glass Cards & Effects ===== */
.glass-card {
  background: color-mix(in srgb, var(--color-surface-main) 70%, transparent);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid var(--color-border-main);
  box-shadow: 
    0 4px 24px -8px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.01);
  border-radius: 1.25rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

:is(.dark) .glass-card {
  box-shadow: 
    0 8px 32px -8px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.1);
}

.hover-glow:hover {
  border-color: var(--color-primary-main);
  box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary-main) 15%, transparent);
  transform: translateY(-2px);
}

.highlight-card {
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-success-main) 5%, var(--color-surface-main)), color-mix(in srgb, var(--color-success-main) 10%, var(--color-surface-main)));
  border-color: color-mix(in srgb, var(--color-success-main) 20%, transparent);
}

.highlight-card:hover {
  border-color: var(--color-success-main);
  box-shadow: 0 8px 32px color-mix(in srgb, var(--color-success-main) 20%, transparent);
}

.mt-6 {
  margin-top: 1.5rem;
}

/* ===== Card Common ===== */
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
  color: var(--color-text-primary);
}

/* ===== Donut Chart & Legend ===== */
.chart-container {
  display: flex;
  align-items: center;
  gap: 3.5rem;
  padding: 1.5rem 1rem;
}

.donut-chart-mock {
  position: relative;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: scale-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes scale-up {
  from { opacity: 0; transform: scale(0.9) rotate(-10deg); }
  to { opacity: 1; transform: scale(1) rotate(0); }
}

.donut-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  mask-image: radial-gradient(transparent 60%, black 61%);
  -webkit-mask-image: radial-gradient(transparent 60%, black 61%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
}

.donut-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.total-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.total-value {
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.text-error-main {
  color: var(--color-error-main);
}

.text-success-main {
  color: var(--color-success-main);
}

.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.legend-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  opacity: 0;
  animation: fade-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-slide-in {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

.legend-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.legend-info > div {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-info .name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.legend-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-stats .value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.legend-stats .percentage {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  background: color-mix(in srgb, var(--color-text-secondary) 10%, transparent);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.progress-bg {
  width: 100%;
  height: 6px;
  background: color-mix(in srgb, var(--color-border-main) 60%, transparent);
  border-radius: 99px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 99px;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 10px opacity(0.5); /* subtle glow on fill */
}

/* ===== Placeholder Flow Chart ===== */
.flow-placeholder {
  padding: 1rem 1rem;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  flex: 1;
  padding-bottom: 2rem;
  position: relative;
  background-image: linear-gradient(to right, color-mix(in srgb, var(--color-border-main) 60%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-border-main) 60%, transparent) 1px, transparent 1px);
  background-size: 100% 25%;
  border-bottom: 1px solid var(--color-border-main);
}

.bar-group {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 100%;
  position: relative;
  width: 44px;
  justify-content: center;
  z-index: 2;
  opacity: 0;
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bar {
  width: 14px;
  border-radius: 4px 4px 0 0;
  transform-origin: bottom;
  transition: all 0.3s ease;
}

.bar:hover {
  filter: brightness(1.1);
}

.bar.income { background: var(--color-success-main); }
.bar.expense { background: var(--color-error-main); }

.bar-label {
  position: absolute;
  bottom: -28px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.flow-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.legend-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.pill-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.pill-dot.income { background: var(--color-success-main); }
.pill-dot.expense { background: var(--color-error-main); }


/* ===== Stat Cards ===== */
.stat-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-glow { background: color-mix(in srgb, var(--color-info-main) 12%, transparent); color: var(--color-info-main); }
.warning-glow { background: color-mix(in srgb, var(--color-warning-main) 12%, transparent); color: var(--color-warning-main); }
.success-glow { background: color-mix(in srgb, var(--color-success-main) 12%, transparent); color: var(--color-success-main); }

.stat-label {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin: 0;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 600;
}

.stat-trend.success { color: var(--color-success-main); }
.stat-trend.error { color: var(--color-error-main); }

.stat-subtext {
  font-size: 0.8125rem;
  color: var(--color-text-disabled);
  margin: 0;
  font-weight: 500;
}


/* ===== Animations & Utilities ===== */
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

@media (max-width: 1024px) {
  .reports-content-grid {
    grid-template-columns: 1fr;
  }
  
  .side-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  .chart-container {
    flex-direction: column;
    gap: 2.5rem;
  }
  
  .donut-chart-mock {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 768px) {
  .reports-view {
    padding: 1.5rem 1rem;
  }

  .reports-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .report-filters {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    justify-content: flex-start;
  }
  
  .report-filters::-webkit-scrollbar {
    display: none;
  }
  
  .filter-btn {
    white-space: nowrap;
    flex: 1;
    text-align: center;
  }
}
</style>
