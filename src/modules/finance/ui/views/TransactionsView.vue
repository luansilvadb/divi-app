<template>
  <div class="view-wrapper animate-fade-in relative overflow-hidden min-h-screen">
    <!-- Ultra-Premium Background Decor -->
    <BaseBackgroundOrbs />
    <div class="noise-overlay pointer-events-none" aria-hidden="true"></div>
    
    <!-- Floating Header -->
    <header class="view-header relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
      <div class="header-titles">
        <h1 class="page-title text-4xl font-black tracking-tight text-text-primary">
          Seu <span class="text-primary-main">Fluxo</span> Financeiro
        </h1>
        <p class="page-subtitle text-text-secondary font-medium opacity-80 mt-1 max-w-lg">
          Domine seus hábitos com clareza total. Cada movimento conta uma história.
        </p>
      </div>
      <BaseButton 
        variant="primary" 
        class="new-transaction-btn group shadow-lg hover:shadow-primary-main/20" 
        @click="showForm = true"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </template>
        Nova Transação
      </BaseButton>
    </header>

    <div class="view-content-grid relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- MAIN COLUMN: Actions + List -->
      <main class="lg:col-span-8 space-y-6">
        <!-- Tools & Filtering -->
        <div class="tools-bar glass-card p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div class="month-selector flex items-center bg-bg-main dark:bg-black/20 p-1 rounded-2xl border border-border-main/50">
            <button class="nav-btn h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-all active:scale-95" @click="prevMonth">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div class="px-6 flex flex-col items-center min-w-[140px]">
              <span class="text-[10px] font-bold uppercase tracking-widest text-text-disabled leading-none mb-1">{{ currentDate.getFullYear() }}</span>
              <span class="text-sm font-black text-text-primary tracking-tight leading-none">{{ monthLabelOnly }}</span>
            </div>
            <button class="nav-btn h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-all active:scale-95" @click="nextMonth">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          <div class="search-filter flex-1 min-w-[200px] relative hidden sm:block">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Buscar registros..." 
              class="search-input w-full bg-white/50 dark:bg-black/20 border border-border-main/50 h-11 px-11 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main outline-none transition-all"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        <!-- The List Area -->
        <div class="transaction-list-container glass-card shadow-sm min-h-[500px] overflow-visible">
          <div v-if="store.isLoading" class="loader-container h-[400px] flex flex-col items-center justify-center">
            <div class="premium-spinner"></div>
            <span class="mt-6 text-xs font-bold tracking-widest text-text-disabled uppercase animate-pulse">Sincronizando dados</span>
          </div>

          <div v-else-if="filteredTransactionsArray.length === 0" class="empty-state h-[500px] flex flex-col items-center justify-center text-center px-6">
            <div class="empty-icon-wrapper mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary tracking-tight mb-2">Sem registros neste período</h3>
            <p class="text-text-secondary max-w-xs font-medium opacity-70 mb-8">
              Ainda não há transações registradas para {{ monthLabelOnly }}. Comece clicando no botão abaixo.
            </p>
            <BaseButton variant="primary" @click="showForm = true">
              Adicionar Transação
            </BaseButton>
          </div>

          <div v-else class="transactions-list pb-4">
            <div v-for="(group, date) in groupedTransactions" :key="date" class="date-group mb-6 last:mb-0">
              <div class="date-header px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/40 dark:bg-black/20 border-b border-border-main/5 text-xs font-black uppercase tracking-widest text-text-secondary opacity-80">
                <div class="flex items-center gap-3">
                  <span class="text-primary-main">{{ formatDateDay(date as string) }}</span>
                  <span class="opacity-40">{{ formatDateMonth(date as string) }}</span>
                </div>
                <div class="group-total font-mono text-xs" :class="getDayTotal(group) >= 0 ? 'text-success-main' : 'text-error-main'">
                  {{ formatCurrencySign(getDayTotal(group)) }}
                </div>
              </div>
              
              <div class="group-items space-y-0.5 mt-1">
                <TransactionItem 
                  v-for="t in group" 
                  :key="t.id || t.localId" 
                  :transaction="t"
                  :categoryName="getCategoryName(t.category_id)"
                  :categoryColor="getCategoryColor(t.category_id)"
                  :walletName="getWalletName(t.wallet_id)"
                  showTime
                  class="mx-1 rounded-xl"
                  @delete="handleDelete"
                  @click="handleEdit(t)"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- SIDEBAR -->
      <aside class="lg:col-span-4 space-y-6">
        <!-- Monthly Metrics -->
        <BaseCard class="metrics-card glass-card hover-glow">
          <template #header>
            <div class="card-header-flex">Resumo do Mês</div>
          </template>
          
          <div class="summary-details">
            <div class="summary-item">
              <div class="summary-icon bg-success-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-main)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </div>
              <div class="summary-text">
                <span class="label">Entradas</span>
                <strong class="value text-success-main text-lg">{{ formatCurrency(totalIncome) }}</strong>
              </div>
            </div>
            
            <div class="summary-divider"></div>

            <div class="summary-item">
              <div class="summary-icon bg-error-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-error-main)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </div>
              <div class="summary-text">
                <span class="label">Saídas</span>
                <strong class="value text-error-main text-lg">{{ formatCurrency(totalExpense) }}</strong>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-item pt-2">
              <div class="net-result w-full p-4 rounded-2xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center">
                <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-1">Resultado Líquido</span>
                <div 
                  class="text-2xl font-black tracking-tight"
                  :class="totalBalance >= 0 ? 'text-primary-main' : 'text-error-main'"
                >
                  {{ formatCurrency(totalBalance) }}
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Top Categories Breakdown -->
        <BaseCard class="categories-card glass-card hover-glow">
          <template #header>
            <div class="card-header-flex">Maiores Gastos</div>
          </template>
          
          <div v-if="topCategories.length === 0" class="flex flex-col items-center justify-center py-8 opacity-40">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-3"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span class="text-xs font-bold">Sem dados suficientes</span>
          </div>
          
          <div v-else class="space-y-5">
            <div v-for="cat in topCategories" :key="cat.id" class="rank-box group/item">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: cat.color }"></div>
                  <span class="text-xs font-bold text-text-primary">{{ cat.name }}</span>
                </div>
                <span class="text-[10px] font-mono font-bold text-text-secondary">{{ formatCurrency(cat.total) }}</span>
              </div>
              <div class="h-1.5 w-full bg-bg-main dark:bg-black/10 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000 ease-out" 
                  :style="{ width: cat.percent + '%', backgroundColor: cat.color }"
                ></div>
              </div>
            </div>
            
            <button @click="$router.push('/reports')" class="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary-main hover:opacity-70 transition-all border-t border-border-main/5">
              Ver relatórios completos →
            </button>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Modal Form -->
    <TransactionForm v-if="showForm" @close="showForm = false" @saved="refreshTransactions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseBackgroundOrbs from '@/shared/components/atoms/BaseBackgroundOrbs.vue'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionItem from '../components/TransactionItem.vue'
import type { Transaction } from '@/modules/finance/domain/entities'

const store = useFinanceStore()
const showForm = ref(false)
const currentDate = ref(new Date())
const searchQuery = ref('')

// Helpers for the template
const getCategoryName = (id: string) => store.categories.find(c => c.id === id)?.name || 'Outras'
const getCategoryColor = (id: string) => store.categories.find(c => c.id === id)?.color || 'var(--color-primary-main)'
const getWalletName = (id: string) => store.wallets.find(w => w.id === id)?.name || 'Carteira'

// Premium Computed Labels
const monthLabelOnly = computed(() => {
  return currentDate.value.toLocaleString('pt-BR', { month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase())
})

const filteredTransactionsArray = computed(() => {
  if (!searchQuery.value) return store.transactions
  
  const query = searchQuery.value.toLowerCase()
  return store.transactions.filter(t => 
    t.title.toLowerCase().includes(query) || 
    getCategoryName(t.category_id).toLowerCase().includes(query) ||
    formatCurrency(t.amount).toLowerCase().includes(query)
  )
})

const groupedTransactions = computed(() => {
  const groups: Record<string, Transaction[]> = {}
  
  const sorted = [...filteredTransactionsArray.value].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  sorted.forEach(t => {
    const dateKey = t.date.split('T')[0]
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(t)
  })
  
  return groups
})

const totalIncome = computed(() => 
  store.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
)

const totalExpense = computed(() => 
  store.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
)

const totalBalance = computed(() => totalIncome.value - totalExpense.value)

const topCategories = computed(() => {
  const expenses = store.transactions.filter(t => t.type === 'expense')
  const catMap: Record<string, number> = {}
  
  expenses.forEach(t => {
    catMap[t.category_id] = (catMap[t.category_id] || 0) + t.amount
  })
  
  const sorted = Object.entries(catMap)
    .map(([id, total]) => {
      const cat = store.categories.find(c => c.id === id)
      return {
        id,
        name: cat?.name || 'Outros',
        color: cat?.color || '#9ca3af',
        total
      }
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  if (totalExpense.value === 0) return []
  
  return sorted.map(s => ({
    ...s,
    percent: (s.total / totalExpense.value) * 100
  }))
})

// Initialize
onMounted(async () => {
  if (store.wallets.length === 0) await store.fetchWallets()
  if (store.categories.length === 0) await store.fetchCategories()
  await refreshTransactions()
})

async function refreshTransactions() {
  await store.fetchTransactionsByMonth(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
  )
}

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

// Auto-refresh on month change
watch(currentDate, refreshTransactions)

const handleDelete = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    await store.deleteTransaction(id)
  }
}

const handleEdit = (transaction: Transaction) => {
  // To be implemented: set editing transaction in store and open form
  console.log('Edit', transaction)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function formatCurrencySign(amount: number) {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    signDisplay: 'always'
  }).format(amount)
}

function formatDateDay(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  today.setHours(0,0,0,0)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  
  const check = new Date(date); check.setHours(0,0,0,0)
  if (check.getTime() === today.getTime()) return 'Hoje'
  if (check.getTime() === yesterday.getTime()) return 'Ontem'
  
  return date.getDate().toString().padStart(2, '0')
}

function formatDateMonth(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
}

function getDayTotal(transactions: Transaction[]) {
  return transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount
  }, 0)
}
</script>

<style scoped>
/* Glass Cards & Effects */
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

:is(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}

.hover-glow:hover {
  border-color: rgba(var(--color-primary-main-rgb, 59, 130, 246), 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Header & Inputs */
.new-transaction-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.9);
}

:is(.dark) .search-input:focus {
  background: rgba(15, 23, 42, 0.8);
}

/* Empty State */
.empty-icon-wrapper {
  width: 96px;
  height: 96px;
  background: linear-gradient(135deg, rgba(var(--color-primary-main-rgb, 59, 130, 246), 0.1), rgba(var(--color-secondary-main-rgb, 16, 185, 129), 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-main);
}

/* Metrics & Sidebar */
.card-header-flex {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.summary-divider {
  height: 1px;
  background: rgba(0,0,0,0.06);
  margin: 0.25rem 0;
}

:is(.dark) .summary-divider {
  background: rgba(255,255,255,0.06);
}

.summary-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-success-light { background: rgba(var(--color-success-main-rgb, 16, 185, 129), 0.1); }
.bg-error-light { background: rgba(var(--color-error-main-rgb, 239, 68, 68), 0.1); }

.summary-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.summary-text .label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.summary-text .value {
  font-size: 1.25rem;
  font-weight: 800;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.premium-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(var(--color-primary-main-rgb, 59, 130, 246), 0.1);
  border-top-color: var(--color-primary-main);
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Grid Layout Fixes */
.view-content-grid {
  align-items: start;
}

@media (max-width: 1024px) {
  .view-header {
    margin-bottom: 2rem;
  }
}
</style>
