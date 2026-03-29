<template>
  <div class="dashboard-view">
    <header class="dashboard-header">
      <h1>Financial Health Dashboard</h1>
      <BaseButton @click="showTransactionForm = true">+ Quick Transaction</BaseButton>
    </header>

    <div class="dashboard-grid">
      <!-- Account Overview -->
      <section class="dashboard-column main-col">
        <AccountCarousel :wallets="store.wallets" />
        
        <BaseCard class="chart-section">
          <template #header>Patrimonial Growth</template>
          <PatrimonialChart :data="growthData" :labels="growthLabels" />
        </BaseCard>

        <SummaryPanels 
          :overdueAmount="450.00" 
          :overdueCount="2" 
          :futureAmount="1200.00" 
        />
      </section>

      <!-- Recent Activity & Budgets -->
      <aside class="dashboard-column side-col">
        <BaseCard class="recent-activity">
          <template #header>Recent Transactions</template>
          <div v-if="store.transactions.length === 0" class="empty">No recent activity.</div>
          <ul v-else class="activity-list">
            <li v-for="t in store.transactions.slice(0, 5)" :key="t.id || t.localId" class="activity-item">
              <div class="activity-info">
                <span class="activity-title">{{ t.title }}</span>
                <span class="activity-date">{{ formatDate(t.date) }}</span>
              </div>
              <span :class="['activity-amount', t.type]">
                {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
              </span>
            </li>
          </ul>
          <template #footer>
            <BaseButton variant="ghost" @click="$router.push('/transactions')">View All</BaseButton>
          </template>
        </BaseCard>

        <!-- Placeholder for Budgets -->
        <BaseCard class="budget-overview">
          <template #header>Budget Consumption (50/30/20)</template>
          <div class="budget-placeholder">
            <div class="budget-item">
              <span>Essential (50%)</span>
              <div class="progress-bar"><div class="progress" style="width: 65%"></div></div>
              <span>R$ 2.450 / R$ 3.750</span>
            </div>
          </div>
          <template #footer>
            <BaseButton variant="ghost" @click="$router.push('/budgets')">Manage Budgets</BaseButton>
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
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import BaseButton from '../../../../shared/components/atoms/BaseButton.vue'
import BaseCard from '../../../../shared/components/atoms/BaseCard.vue'
import AccountCarousel from '../components/AccountCarousel.vue'
import PatrimonialChart from '../components/PatrimonialChart.vue'
import SummaryPanels from '../components/SummaryPanels.vue'
import TransactionForm from '../components/TransactionForm.vue'

const store = useFinanceStore()
const showTransactionForm = ref(false)

// Mock chart data for now
const growthData = [15000, 16200, 15800, 17500, 18900, 20100]
const growthLabels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

onMounted(async () => {
  await refreshData()
})

async function refreshData() {
  const now = new Date()
  await Promise.all([
    store.fetchWallets(),
    store.fetchCategories(),
    store.fetchTransactionsByMonth(now.getFullYear(), now.getMonth() + 1)
  ])
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}
</script>

<style scoped>
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}
.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-section {
  padding: 1.5rem;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.activity-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
}
.activity-item:last-child {
  border-bottom: none;
}
.activity-info {
  display: flex;
  flex-direction: column;
}
.activity-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
}
.activity-date {
  font-size: 0.75rem;
  color: #9ca3af;
}
.activity-amount {
  font-weight: 600;
  font-size: 0.9375rem;
}
.activity-amount.expense {
  color: #ef4444;
}
.activity-amount.income {
  color: #10b981;
}

.budget-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
.progress-bar {
  height: 8px;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
}
.progress {
  height: 100%;
  background: #10b981;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .side-col {
    order: 2;
  }
}
</style>
