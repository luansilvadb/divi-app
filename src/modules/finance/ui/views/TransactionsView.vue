<template>
  <div class="transactions-view">
    <div class="view-header">
      <h1>Transactions</h1>
      <BaseButton @click="showForm = true">+ New Transaction</BaseButton>
    </div>

    <div class="month-selector">
      <BaseButton variant="ghost" @click="prevMonth">&lt;</BaseButton>
      <span class="current-month">{{ monthLabel }}</span>
      <BaseButton variant="ghost" @click="nextMonth">&gt;</BaseButton>
    </div>

    <BaseCard class="transaction-list">
      <div v-if="store.isLoading" class="loading">Loading...</div>
      <div v-else-if="store.transactions.length === 0" class="empty">
        No transactions found for this month.
      </div>
      <div v-else class="transactions">
        <div v-for="t in store.transactions" :key="t.id || t.localId" class="transaction-item">
          <div class="t-main">
            <span class="t-date">{{ formatDate(t.date) }}</span>
            <span class="t-title">{{ t.title }}</span>
          </div>
          <div class="t-meta">
            <BaseBadge :color="getCategoryColor(t.category_id)">
              {{ getCategoryName(t.category_id) }}
            </BaseBadge>
            <span :class="['t-amount', t.type]">
              {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
            </span>
          </div>
        </div>
      </div>
    </BaseCard>

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
import BaseCard from '../../../../shared/components/atoms/BaseCard.vue'
import BaseBadge from '../../../../shared/components/atoms/BaseBadge.vue'
import TransactionForm from '../components/TransactionForm.vue'

const store = useFinanceStore()
const showForm = ref(false)
const currentDate = ref(new Date())

const monthLabel = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
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
  return new Date(dateStr).toLocaleDateString()
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

function getCategoryName(id: string) {
  return store.categories.find(c => c.id === id)?.name || 'Unknown'
}

function getCategoryColor(id: string) {
  return store.categories.find(c => c.id === id)?.color || '#9ca3af'
}
</script>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.current-month {
  font-size: 1.125rem;
  font-weight: 600;
  text-transform: capitalize;
}
.transaction-list {
  padding: 0;
}
.loading, .empty {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}
.transaction-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
}
.transaction-item:last-child {
  border-bottom: none;
}
.t-main {
  display: flex;
  flex-direction: column;
}
.t-date {
  font-size: 0.75rem;
  color: #9ca3af;
}
.t-title {
  font-weight: 500;
  color: #111827;
}
.t-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.t-amount {
  font-weight: 600;
  min-width: 100px;
  text-align: right;
}
.t-amount.expense {
  color: #ef4444;
}
.t-amount.income {
  color: #10b981;
}
</style>
