<template>
  <div class="view-wrapper animate-fade-in">
    <!-- Background Decor -->
    <BaseBackgroundOrbs />

    <!-- Header Section -->
    <header class="view-header">
      <div class="title-section">
        <h1 class="page-title">
          Dashboard <span class="text-accent-main">Financeiro</span>
        </h1>
        <p class="page-subtitle">Bem-vindo de volta! Aqui está um resumo da sua saúde financeira.</p>
      </div>
      <div class="header-actions">
        <BaseButton 
          variant="primary" 
          class="quick-action-btn"
          @click="showTransactionForm = true"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </template>
          Nova Transação
        </BaseButton>
      </div>
    </header>

    <div class="view-content-grid">
      <!-- Main Column: Charts and Wallets -->
      <div class="main-column">
        <!-- Stats Summary -->
        <div class="stats-overview-grid">
          <div class="stat-card glass-card hover-glow">
            <div class="stat-icon income-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Entradas (Mes)</span>
              <h3 class="stat-value text-success-main">{{ formatCurrency(totalIncome) }}</h3>
            </div>
          </div>
          
          <div class="stat-card glass-card hover-glow">
            <div class="stat-icon expense-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Saídas (Mes)</span>
              <h3 class="stat-value text-error-main">{{ formatCurrency(totalExpense) }}</h3>
            </div>
          </div>

          <div class="stat-card glass-card hover-glow">
            <div class="stat-icon balance-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-label">Saldo Geral</span>
              <h3 class="stat-value">{{ formatCurrency(store.totalBalance) }}</h3>
            </div>
          </div>
        </div>

        <!-- Wallets Carousel -->
        <section class="wallets-section mt-8">
          <div class="section-header">
            <h2 class="section-title">Minhas Contas</h2>
            <BaseButton variant="ghost" size="sm" @click="$router.push('/wallets')">Ver todas</BaseButton>
          </div>
          <AccountCarousel :wallets="store.wallets" />
        </section>

        <!-- Chart Section -->
        <BaseCard class="growth-chart-card mt-8 glass-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">Evolução Patrimonial</span>
              <div class="chart-period">Últimos 6 meses</div>
            </div>
          </template>
          <div class="chart-wrapper">
            <PatrimonialChart :data="growthData" :labels="growthLabels" />
          </div>
        </BaseCard>
      </div>

      <!-- Right Column: Sidebar info -->
      <aside class="side-column">
        <!-- Quick Summary Panel -->
        <SummaryPanels 
          :overdueAmount="450.00" 
          :overdueCount="2" 
          :futureAmount="1200.00" 
        />

        <!-- Recent Transactions -->
        <BaseCard class="recent-activity-card glass-card">
          <template #header>Transações Recentes</template>
          
          <div v-if="store.transactions.length === 0" class="empty-state">
            <div class="empty-icon">☕</div>
            <p>Nenhuma transação este mês.</p>
          </div>
          
          <ul v-else class="activity-list">
            <li v-for="t in store.transactions.slice(0, 5)" :key="t.id || t.localId" class="activity-item">
              <div class="activity-icon-container" :class="t.type">
                <svg v-if="t.type === 'expense'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </div>
              <div class="activity-details">
                <span class="activity-title text-truncate">{{ t.title }}</span>
                <span class="activity-date">{{ formatDate(t.date) }}</span>
              </div>
              <span :class="['activity-amount', t.type]">
                {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
              </span>
            </li>
          </ul>
          
          <template #footer>
            <button class="view-all-link" @click="$router.push('/transactions')">
              Ver histórico completo
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </template>
        </BaseCard>

        <!-- Budget Progress -->
        <BaseCard class="budget-card glass-card">
          <template #header>Orçamento Mensal (50/30/20)</template>
          <div class="budget-content">
            <div class="budget-item">
              <div class="budget-info">
                <span class="label">Essencial</span>
                <span class="percentage">65% consumido</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill warning" style="width: 65%"></div>
              </div>
              <div class="budget-footer">
                <span>R$ 2.450 de R$ 3.750</span>
              </div>
            </div>

            <div class="budget-item mt-4">
              <div class="budget-info">
                <span class="label">Lazer</span>
                <span class="percentage">30% consumido</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill success" style="width: 30%"></div>
              </div>
              <div class="budget-footer">
                <span>R$ 600 de R$ 2.000</span>
              </div>
            </div>
          </div>
          <template #footer>
            <button class="view-all-link" @click="$router.push('/budgets')">
              Configurar limites
            </button>
          </template>
        </BaseCard>
      </aside>
    </div>

    <TransactionForm 
      v-if="showTransactionForm" 
      @close="showTransactionForm = false" 
      @saved="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import BaseButton from '../../../../shared/components/atoms/BaseButton.vue'
import BaseCard from '../../../../shared/components/atoms/BaseCard.vue'
import AccountCarousel from '../components/AccountCarousel.vue'
import PatrimonialChart from '../components/PatrimonialChart.vue'
import SummaryPanels from '../components/SummaryPanels.vue'
import TransactionForm from '../components/TransactionForm.vue'
import BaseBackgroundOrbs from '../../../../shared/components/atoms/BaseBackgroundOrbs.vue'

const store = useFinanceStore()
const showTransactionForm = ref(false)

// Mock chart data - In real app, this would come from a computed or store action
const growthData = [15000, 16200, 15800, 17500, 18900, 20100]
const growthLabels = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar']

const totalIncome = computed(() => {
  return store.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpense = computed(() => {
  return store.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

onMounted(async () => {
  await refreshData()
})

async function refreshData() {
  const now = new Date()
  await Promise.all([
    store.fetchWallets(),
    store.fetchCategories(),
    store.fetchTransactionsByMonth(now.getFullYear(), now.getMonth() + 1),
    store.fetchLoans(),
    store.fetchSubscriptions()
  ])
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}
</script>

<style scoped>
/* Layout Grid */

/* Glass Cards & Effects */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

:is(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}

.hover-glow:hover {
  border-color: var(--color-primary-main);
  box-shadow: 0 0 20px rgba(var(--color-primary-main-rgb), 0.1);
  transform: translateY(-2px);
}

/* Stats Overview */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 1.25rem;
  transition: all 0.3s ease;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.income-bg { background: rgba(16, 185, 129, 0.1); color: var(--color-success-main); }
.expense-bg { background: rgba(239, 68, 68, 0.1); color: var(--color-error-main); }
.balance-bg { background: rgba(var(--color-primary-main-rgb), 0.1); color: var(--color-primary-main); }

.stat-label {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  display: block;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

/* Section Common */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Activity List Premium */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border-main);
  transition: background 0.2s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon-container {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.activity-icon-container.income { background: rgba(16, 185, 129, 0.1); color: var(--color-success-main); }
.activity-icon-container.expense { background: rgba(239, 68, 68, 0.1); color: var(--color-error-main); }

.activity-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.activity-title {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.9375rem;
  line-height: 1.2;
}

.activity-date {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.activity-amount {
  font-weight: 700;
  font-size: 0.9375rem;
  margin-left: 1rem;
}

.activity-amount.income { color: var(--color-success-main); }
.activity-amount.expense { color: var(--color-error-main); }

/* Budget Progress Premium */
.budget-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.budget-info .label {
  font-weight: 600;
  font-size: 0.875rem;
}

.budget-info .percentage {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.progress-track {
  height: 8px;
  background: rgba(0,0,0,0.05);
  border-radius: 99px;
  overflow: hidden;
}

:is(.dark) .progress-track {
  background: rgba(255,255,255,0.05);
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-fill.success { background: var(--color-success-main); }
.progress-fill.warning { background: var(--color-warning-main); }
.progress-fill.error { background: var(--color-error-main); }

.budget-footer {
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  margin-top: 0.5rem;
  text-align: right;
}

/* Helpers */
.view-all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background: none;
  border: none;
  color: var(--color-primary-main);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: gap 0.2s ease;
}

.view-all-link:hover {
  gap: 0.75rem;
  color: var(--color-secondary-main);
}

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-text-disabled);
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.chart-title { font-weight: 700; }
.chart-period { font-size: 0.75rem; font-weight: 400; opacity: 0.7; }

/* Responsive */
@media (max-width: 768px) {
  .stats-overview-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .quick-action-btn {
    width: 100%;
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
