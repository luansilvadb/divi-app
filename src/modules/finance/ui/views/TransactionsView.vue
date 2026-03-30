<template>
  <div class="transactions-view animate-fade-in">
    <!-- Animated background orbs -->
    <div class="transactions-bg-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="noise-overlay" aria-hidden="true"></div>

    <div class="transactions-content">
      <header class="view-header">
        <div class="header-titles">
          <h1 class="page-title">
            Suas <span class="text-gradient">Transações</span>
          </h1>
          <p class="page-subtitle">Acompanhe e gerencie sua movimentação financeira.</p>
        </div>
        <BaseButton @click="showForm = true" class="new-transaction-btn">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </template>
          Nova Transação
        </BaseButton>
      </header>

      <div class="controls-section glass-panel">
        <div class="month-selector">
          <button class="icon-btn" @click="prevMonth" aria-label="Mês anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="current-month">{{ monthLabel }}</span>
          <button class="icon-btn" @click="nextMonth" aria-label="Próximo mês">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div class="transaction-list-container glass-panel">
        <div v-if="store.isLoading" class="state-container">
          <div class="spinner"></div>
          <p>Carregando transações...</p>
        </div>
        
        <div v-else-if="store.transactions.length === 0" class="state-container empty-state">
          <div class="empty-icon">📝</div>
          <h3>Nenhuma transação</h3>
          <p>Você não possui transações neste mês.</p>
          <BaseButton variant="ghost" @click="showForm = true" class="mt-4">
            Adicionar primeira transação
          </BaseButton>
        </div>
        
        <div v-else class="transactions-list">
          <div v-for="t in store.transactions" :key="t.id || t.localId" class="transaction-item group">
            <div class="t-icon-container" :class="t.type">
              <svg v-if="t.type === 'expense'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </div>
            
            <div class="t-main">
              <span class="t-title">{{ t.title }}</span>
              <span class="t-date">{{ formatDate(t.date) }}</span>
            </div>
            
            <div class="t-meta">
              <div 
                class="category-badge" 
                :style="{ '--cat-color': getCategoryColor(t.category_id) }"
              >
                <div class="cat-dot"></div>
                {{ getCategoryName(t.category_id) }}
              </div>
              
              <span class="t-amount" :class="t.type">
                {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TransactionForm 
      v-if="showForm" 
      @close="showForm = false" 
      @saved="refreshTransactions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import BaseButton from '../../../../shared/components/atoms/BaseButton.vue'
import TransactionForm from '../components/TransactionForm.vue'

const store = useFinanceStore()
const showForm = ref(false)
const currentDate = ref(new Date())

const monthLabel = computed(() => {
  return currentDate.value.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
})

onMounted(async () => {
  await Promise.all([
    store.fetchWallets(),
    store.fetchCategories(),
    refreshTransactions()
  ])
})

async function refreshTransactions() {
  await store.fetchTransactionsByMonth(
    currentDate.value.getFullYear(), 
    currentDate.value.getMonth() + 1
  )
}

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  refreshTransactions()
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  refreshTransactions()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

function getCategoryName(id: string) {
  return store.categories.find(c => c.id === id)?.name || 'Outros'
}

function getCategoryColor(id: string) {
  return store.categories.find(c => c.id === id)?.color || '#9ca3af'
}
</script>

<style scoped>
/* Base View */
.transactions-view {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 2.5rem;
  box-sizing: border-box;
}

/* Background & Noise */
.transactions-bg-orbs {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  will-change: transform;
}

:is(.dark) .orb {
  opacity: 0.2;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--color-primary-main);
  top: -100px;
  right: -50px;
  animation: float-1 20s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: var(--color-secondary-main);
  bottom: 10%;
  left: -50px;
  animation: float-2 25s ease-in-out infinite;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: var(--color-accent-main);
  top: 40%;
  right: 20%;
  animation: float-3 18s ease-in-out infinite;
  opacity: 0.1;
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, 40px) scale(1.05); }
}

@keyframes float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -20px) scale(1.1); }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, -40px) scale(0.95); }
}

.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
}

.transactions-content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.new-transaction-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(var(--color-primary-main-rgb), 0.25);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.new-transaction-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--color-primary-main-rgb), 0.35);
}

/* Glass Panel Shared */
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1.5rem;
  box-shadow:
    0 4px 20px -2px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

:is(.dark) .glass-panel {
  background: rgba(22, 27, 34, 0.6);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow:
    0 4px 24px -4px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

/* Controls Section (Month Selector) */
.controls-section {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: center;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-text-primary);
  transform: scale(1.05);
}

:is(.dark) .icon-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.icon-btn:active {
  transform: scale(0.95);
}

.current-month {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: capitalize;
  min-width: 160px;
  text-align: center;
}

/* Transactions Container */
.transaction-list-container {
  overflow: hidden;
  min-height: 400px;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

/* Spinner */
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border-main);
  border-top-color: var(--color-primary-main);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transaction List Item */
.transactions-list {
  display: flex;
  flex-direction: column;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border-main);
  transition: background 0.2s ease;
  gap: 1.25rem;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

:is(.dark) .transaction-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.t-icon-container {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.transaction-item:hover .t-icon-container {
  transform: scale(1.05);
}

.t-icon-container.income { 
  background: rgba(16, 185, 129, 0.1); 
  color: var(--color-success-main); 
}

.t-icon-container.expense { 
  background: rgba(239, 68, 68, 0.1); 
  color: var(--color-error-main); 
}

.t-icon-container svg {
  width: 20px;
  height: 20px;
}

.t-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.t-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.t-date {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

.t-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.375rem;
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  color: var(--color-text-secondary);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

:is(.dark) .category-badge {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.05);
}

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cat-color);
  box-shadow: 0 0 8px var(--cat-color);
}

.t-amount {
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
}

.t-amount.income {
  color: var(--color-success-main);
}

.t-amount.expense {
  color: var(--color-error-main);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .transactions-view {
    padding: 1.5rem 1rem;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .new-transaction-btn {
    width: 100%;
    justify-content: center;
  }

  .transaction-item {
    flex-wrap: wrap;
    padding: 1rem;
  }

  .t-meta {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    padding-left: 3.5rem; /* width of icon + gap */
  }
  
  .t-amount {
    font-size: 1rem;
  }
}
</style>
