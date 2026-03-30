<template>
  <div class="view-wrapper animate-fade-in relative min-h-screen">
    <!-- Visual background shell -->

    <!-- Feature header -->
    <BaseViewHeader
      title="Seu Fluxo Financeiro"
      highlight="Fluxo"
      subtitle="Domine seus hábitos com clareza total. Cada movimento conta uma história."
    >
      <template #action>
        <BaseButton variant="primary" @click="showForm = true"> Nova Transação </BaseButton>
      </template>
    </BaseViewHeader>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN: Actions + List -->
      <main class="main-column">
        <!-- Tools & Filtering -->
        <div
          class="glass-card p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm mb-6"
        >
          <!-- Month Selector -->
          <div
            class="flex items-center bg-bg-main dark:bg-black/20 p-1.5 rounded-2xl border border-black/5 dark:border-white/5"
          >
            <button
              class="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-all active:scale-95"
              @click="prevMonth"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div class="px-6 flex flex-col items-center min-w-[140px]">
              <span
                class="text-[10px] font-black uppercase tracking-widest text-text-disabled leading-none mb-1"
                >{{ currentDate.getFullYear() }}</span
              >
              <span
                class="text-sm font-black text-text-primary tracking-tight leading-none uppercase"
                >{{ monthLabelOnly }}</span
              >
            </div>
            <button
              class="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-all active:scale-95"
              @click="nextMonth"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <!-- Search Input -->
          <div class="flex-1 min-w-[200px] relative hidden sm:block">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar registros..."
              class="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 h-12 px-11 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main outline-none transition-all placeholder:text-text-disabled"
            />
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <!-- The List Area -->
        <div class="glass-card shadow-sm min-h-[500px] overflow-hidden">
          <!-- Loading State -->
          <div
            v-if="store.isLoading"
            class="h-[500px] flex flex-col items-center justify-center text-center"
          >
            <div
              class="w-12 h-12 border-4 border-primary-main/10 border-t-primary-main rounded-full animate-spin"
            ></div>
            <span
              class="mt-8 text-[10px] font-black tracking-widest text-text-disabled uppercase animate-pulse"
              >Sincronizando dados</span
            >
          </div>

          <!-- Empty State -->
          <div
            v-else-if="filteredTransactionsArray.length === 0"
            class="h-[500px] flex flex-col items-center justify-center text-center px-6"
          >
            <BaseIconBox color="var(--color-primary-main)" size="lg" class="mb-6 opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </BaseIconBox>
            <h3 class="text-2xl font-black text-text-primary tracking-tight mb-2">
              Sem registros neste período
            </h3>
            <p class="text-text-secondary max-w-xs font-medium text-sm leading-relaxed mb-8">
              Ainda não há transações registradas para {{ monthLabelOnly }}. Comece clicando no
              botão abaixo.
            </p>
            <BaseButton variant="primary" @click="showForm = true">
              Adicionar Transação
            </BaseButton>
          </div>

          <!-- Grouped List -->
          <div v-else class="py-2">
            <div v-for="(group, date) in groupedTransactions" :key="date" class="mb-4 last:mb-0">
              <!-- Sticky Date Header -->
              <div
                class="px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/40 dark:bg-black/20 border-b border-black/5 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-text-disabled"
              >
                <div class="flex items-center gap-3">
                  <span class="text-primary-main font-black">{{
                    getRelativeDayLabel(date as string)
                  }}</span>
                  <span class="opacity-50 font-black">{{ formatDateMonth(date as string) }}</span>
                </div>
                <div
                  class="font-bold tracking-tight"
                  :class="getDayTotal(group) >= 0 ? 'text-success-main' : 'text-error-main'"
                >
                  {{ formatCurrencySign(getDayTotal(group)) }}
                </div>
              </div>

              <!-- Transaction Items -->
              <div class="space-y-0.5 mt-1 px-1">
                <TransactionItem
                  v-for="t in group"
                  :key="t.id || t.localId"
                  :transaction="t"
                  :categoryName="store.categoryMap.get(t.category_id)?.name || 'Outras'"
                  :categoryColor="
                    store.categoryMap.get(t.category_id)?.color || 'var(--color-primary-main)'
                  "
                  :walletName="store.walletMap.get(t.wallet_id)?.name || 'Carteira'"
                  showTime
                  class="rounded-xl"
                  @delete="handleDelete"
                  @click="handleEdit(t)"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <!-- Monthly Metrics -->
        <BaseCard>
          <template #header>
            <div class="flex justify-between items-center w-full">
              <span>Resumo do Mês</span>
              <div class="text-[0.7rem] uppercase font-black opacity-40 tracking-widest">
                {{ monthLabelOnly }}
              </div>
            </div>
          </template>

          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Entradas"
              :value="formatCurrency(store.totalIncome)"
              color="var(--color-success-main)"
              status="success"
            >
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </template>
            </BaseSummaryItem>

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <BaseSummaryItem
              label="Saídas"
              :value="formatCurrency(store.totalExpense)"
              color="var(--color-error-main)"
              status="error"
            >
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </template>
            </BaseSummaryItem>

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <!-- Net Result Highlight -->
            <div
              class="w-full p-5 rounded-3xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center shadow-inner border border-black/5 dark:border-white/5"
            >
              <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-2"
                >Resultado Líquido</span
              >
              <div
                class="text-3xl font-black tracking-tighter"
                :class="store.monthlyBalance >= 0 ? 'text-primary-main' : 'text-error-main'"
              >
                {{ formatCurrencySign(store.monthlyBalance) }}
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Top Categories Breakdown -->
        <BaseCard>
          <template #header>Maiores Gastos</template>

          <!-- Empty Category State -->
          <div
            v-if="store.topCategories.length === 0"
            class="flex flex-col items-center justify-center py-12 opacity-40 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mb-4"
            >
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              />
            </svg>
            <span class="text-[10px] font-black uppercase tracking-widest"
              >Sem dados no período</span
            >
          </div>

          <!-- Category Progress Bars -->
          <div v-else class="flex flex-col gap-6 pt-2">
            <div v-for="cat in store.topCategories" :key="cat.id" class="flex flex-col gap-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div
                    class="w-2.5 h-2.5 rounded-full shadow-sm"
                    :style="{ backgroundColor: cat.color }"
                  ></div>
                  <span
                    class="text-[11px] font-black uppercase tracking-widest text-text-primary"
                    >{{ cat.name }}</span
                  >
                </div>
                <span class="text-[11px] font-black tracking-tight text-text-disabled">{{
                  formatCurrency(cat.total)
                }}</span>
              </div>
              <BaseProgressBar :percentage="cat.percent" :color="cat.color" />
            </div>

            <BaseButton
              variant="ghost"
              class="w-full text-[10px] uppercase font-black tracking-widest mt-4"
              @click="$router.push('/reports')"
            >
              Relatórios completos →
            </BaseButton>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Modals -->
    <TransactionForm v-if="showForm" @close="showForm = false" @saved="refreshTransactions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { formatCurrency, formatCurrencySign, getRelativeDayLabel } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import BaseViewHeader from '@/shared/components/organisms/BaseViewHeader.vue'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionItem from '../components/TransactionItem.vue'
import type { Transaction } from '@/modules/finance/domain/entities'

const store = useFinanceStore()
const showForm = ref(false)
const currentDate = ref(new Date())
const searchQuery = ref('')

// Helpers for the template
// Getters replaced with O(1) store maps

// Date Labels
const monthLabelOnly = computed(() => {
  return currentDate.value
    .toLocaleString('pt-BR', { month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase())
})

// Search Logic
const filteredTransactionsArray = computed(() => {
  if (!searchQuery.value) return store.transactions

  const query = searchQuery.value.toLowerCase()
  return store.transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(query) ||
      (store.categoryMap.get(t.category_id)?.name || 'Outras').toLowerCase().includes(query) ||
      formatCurrency(t.amount).toLowerCase().includes(query),
  )
})

// Grouping Logic
const groupedTransactions = computed(() => {
  const groups: Record<string, Transaction[]> = {}

  const sorted = [...filteredTransactionsArray.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  sorted.forEach((t) => {
    const dateKey = t.date.split('T')[0]
    if (dateKey) {
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(t)
    }
  })

  return groups
})

// Summary Calculations

// Category Analysis

// Initialization
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

// Watchers
watch(currentDate, refreshTransactions)

// Actions
const handleDelete = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    await store.deleteTransaction(id)
  }
}

const handleEdit = (transaction: Transaction) => {
  console.log('Edit', transaction)
}

// Formatting Helper (Day Label)
function formatDateMonth(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
}

// Daily Total Calculation
function getDayTotal(transactions: Transaction[]) {
  return transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount
  }, 0)
}
</script>

<style scoped>
/* Scoped styles removed in favor of Tailwind and shared glassmorphism */
</style>
