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
              <span class="text-sm font-black uppercase tracking-widest">{{ monthLabelOnly }}</span>
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
          <div class="relative flex-1 min-w-[200px]">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-text-disabled"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar transações..."
              class="w-full pl-11 pr-4 py-3 bg-bg-main dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl text-sm font-bold placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-main/20 transition-all"
            />
          </div>
        </div>

        <!-- Transactions List -->
        <div class="space-y-6">
          <div
            v-if="store.isLoading"
            class="flex flex-col items-center justify-center py-20 opacity-50"
          >
            <div
              class="w-8 h-8 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin mb-4"
            ></div>
            <span class="text-xs font-black uppercase tracking-widest">Sincronizando...</span>
          </div>

          <div
            v-else-if="Object.keys(groupedTransactions).length === 0"
            class="flex flex-col items-center justify-center py-20 opacity-40 text-center glass-card"
          >
            <div
              class="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span class="text-sm font-black uppercase tracking-widest mb-2">Nenhuma transação</span>
            <span class="text-xs font-bold"
              >Você não tem movimentos registrados neste período.</span
            >
            <BaseButton variant="ghost" class="mt-6" @click="showForm = true">
              Adicionar Agora
            </BaseButton>
          </div>

          <!-- Grouped by Date -->
          <div v-else class="space-y-8">
            <div v-for="(group, dateKey) in groupedTransactions" :key="dateKey" class="space-y-3">
              <!-- Date Header -->
              <div class="flex items-center justify-between px-2 mb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center leading-none"
                  >
                    <span
                      class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
                      >{{ formatDateMonth(dateKey) }}</span
                    >
                    <span class="text-sm font-black">{{ dateKey.split('-')[2] }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black">{{ getRelativeDayLabel(dateKey) }}</span>
                  </div>
                </div>

                <div
                  class="text-sm font-black tracking-tighter bg-bg-main dark:bg-black/20 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5"
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
                  :categoryName="store.categoryMap[t.category_id]?.name || 'Outras'"
                  :categoryColor="
                    store.categoryMap[t.category_id]?.color || 'var(--color-primary-main)'
                  "
                  :walletName="store.walletMap[t.wallet_id]?.name || 'Carteira'"
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

// Date Labels
const monthLabelOnly = computed(() => {
  return currentDate.value
    .toLocaleString('pt-BR', { month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase())
})

// Search Logic: Optimized text matching
const filteredTransactionsArray = computed(() => {
  if (!searchQuery.value.trim()) return store.transactions

  const query = searchQuery.value.toLowerCase().trim()
  return store.transactions.filter((t) => {
    // Basic match on title
    if (t.title.toLowerCase().includes(query)) return true

    // Category match using dict lookup
    const catName = store.categoryMap[t.category_id]?.name
    if (catName && catName.toLowerCase().includes(query)) return true

    return false // Currency matching was expensive and confusing to users typing 10,00 vs 1000
  })
})

// Grouping Logic: Optimized to minimize string and object allocations
const groupedTransactions = computed(() => {
  const groups: Record<string, Transaction[]> = {}

  // O(N log N) sorting, but parsing timestamp natively once per item if possible
  const sorted = [...filteredTransactionsArray.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  for (const t of sorted) {
    // Avoid split if substring works
    const dateKey = t.date.substring(0, 10)
    if (dateKey) {
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(t)
    }
  }

  return groups
})

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

// Daily Total Calculation: Optimized to straight reduce without O(2N) filters
function getDayTotal(transactions: Transaction[]) {
  return transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount
  }, 0)
}
</script>
