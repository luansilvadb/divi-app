<template>
  <div class="view-container">
    <BaseViewHeader title="Transações" subtitle="Gerencie suas receitas e despesas">
      <template #actions>
        <BaseButton @click="showForm = true" class="shadow-lg shadow-primary-main/20">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </template>
          Nova
        </BaseButton>
      </template>
    </BaseViewHeader>

    <div class="view-content two-columns mt-6">
      <main class="main-column flex flex-col gap-6">
        <!-- Controls -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <div class="flex items-center gap-3 bg-bg-main dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/5 shadow-inner w-full sm:w-auto">
            <button @click="prevMonth" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div class="min-w-[120px] text-center font-black tracking-tight text-text-primary select-none">
              {{ monthLabelOnly }} {{ currentDate.getFullYear() }}
            </div>
            <button @click="nextMonth" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div class="relative w-full sm:w-64">
            <input v-model="searchQuery" type="text" placeholder="Buscar..." class="w-full h-12 pl-12 pr-4 bg-bg-main dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-all text-sm font-medium text-text-primary placeholder:text-text-disabled" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <!-- List -->
        <div v-if="store.isLoading" class="flex flex-col items-center justify-center py-20 text-text-disabled space-y-4">
          <div class="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
          <span class="text-xs font-bold uppercase tracking-widest">Carregando...</span>
        </div>
        <div v-else-if="Object.keys(groupedTransactions).length === 0" class="flex flex-col items-center justify-center py-24 text-text-disabled text-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <p class="text-[11px] font-black uppercase tracking-widest opacity-60">Nenhuma transação encontrada</p>
        </div>
        <div v-else class="flex flex-col gap-8">
          <div v-for="(transactions, date) in groupedTransactions" :key="date" class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <div class="flex flex-col items-center justify-center bg-black/5 dark:bg-white/10 rounded-2xl w-14 h-14">
                <span class="text-xs font-black uppercase tracking-widest text-text-disabled">{{ formatDateMonth(date) }}</span>
                <span class="text-lg font-black tracking-tighter text-text-primary leading-none mt-0.5">{{ date.split('-')[2] }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[11px] font-black uppercase tracking-widest text-text-disabled">{{ getRelativeDayLabel(date) }}</span>
                <span class="text-sm font-black tracking-tight" :class="getDayTotal(transactions) >= 0 ? 'text-success-main' : 'text-text-primary'">
                  {{ formatCurrencySign(getDayTotal(transactions)) }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <TransactionItem v-for="t in transactions" :key="t.id" :transaction="t" :categoryName="store.categoryMap[t.category_id]?.name || 'Outras'" :categoryColor="store.categoryMap[t.category_id]?.color || 'var(--color-primary-main)'" :walletName="store.walletMap[t.wallet_id]?.name || 'Carteira'" showTime class="rounded-xl" @delete="handleDelete" @click="handleEdit(t)" />
            </div>
          </div>
        </div>
      </main>

      <aside class="side-column">
        <BaseCard>
          <template #header>
            <div class="flex justify-between items-center w-full">
              <span>Resumo do Mês</span>
              <div class="text-[0.7rem] uppercase font-black opacity-40 tracking-widest">{{ monthLabelOnly }}</div>
            </div>
          </template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem label="Entradas" :value="formatCurrency(store.totalIncome)" color="var(--color-success-main)" status="success">
              <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></template>
            </BaseSummaryItem>
            <div class="h-px bg-black/5 dark:bg-white/5"></div>
            <BaseSummaryItem label="Saídas" :value="formatCurrency(store.totalExpense)" color="var(--color-error-main)" status="error">
              <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg></template>
            </BaseSummaryItem>
            <div class="h-px bg-black/5 dark:bg-white/5"></div>
            <div class="w-full p-5 rounded-3xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center shadow-inner border border-black/5 dark:border-white/5">
              <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-2">Resultado Líquido</span>
              <div class="text-3xl font-black tracking-tighter" :class="store.monthlyBalance >= 0 ? 'text-primary-main' : 'text-error-main'">{{ formatCurrencySign(store.monthlyBalance) }}</div>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <template #header>Maiores Gastos</template>
          <div v-if="store.topCategories.length === 0" class="flex flex-col items-center justify-center py-12 opacity-40 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest">Sem dados no período</span>
          </div>
          <div v-else class="flex flex-col gap-6 pt-2">
            <div v-for="cat in store.topCategories" :key="cat.id" class="flex flex-col gap-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-full shadow-sm" :style="{ backgroundColor: cat.color }"></div>
                  <span class="text-[11px] font-black uppercase tracking-widest text-text-primary">{{ cat.name }}</span>
                </div>
                <span class="text-[11px] font-black tracking-tight text-text-disabled">{{ formatCurrency(cat.total) }}</span>
              </div>
              <BaseProgressBar :percentage="cat.percent" :color="cat.color" />
            </div>
            <BaseButton variant="ghost" class="w-full text-[10px] uppercase font-black tracking-widest mt-4" @click="$router.push('/reports')">Relatórios completos →</BaseButton>
          </div>
        </BaseCard>
      </aside>
    </div>

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

const monthLabelOnly = computed(() => currentDate.value.toLocaleString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase()))

const uiTransactions = computed(() => store.transactions.map(t => ({
  ...t,
  _titleLower: t.title.toLowerCase(),
  _timestamp: new Date(t.date).getTime(),
  _dateKey: t.date.substring(0, 10)
})))

const filteredTransactionsArray = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return uiTransactions.value

  return uiTransactions.value.filter(t => {
    if (t._titleLower.includes(query)) return true
    const catName = store.categoryMap[t.category_id]?.name
    if (catName && catName.toLowerCase().includes(query)) return true
    return false
  })
})

const groupedTransactions = computed(() => {
  const groups: Record<string, typeof uiTransactions.value> = {}
  const sorted = [...filteredTransactionsArray.value].sort((a, b) => b._timestamp - a._timestamp)

  for (const t of sorted) {
    if (!groups[t._dateKey]) {
      groups[t._dateKey] = []
    }
    groups[t._dateKey]!.push(t)
  }
  return groups
})

onMounted(async () => {
  if (!store.wallets.length) await store.fetchWallets()
  if (!store.categories.length) await store.fetchCategories()
  await refreshTransactions()
})

async function refreshTransactions() { await store.fetchTransactionsByMonth(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1) }
function prevMonth() { currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1) }
function nextMonth() { currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1) }

watch(currentDate, refreshTransactions)

const handleDelete = async (id: string) => { if (id && confirm('Tem certeza que deseja excluir esta transação?')) await store.deleteTransaction(id) }
const handleEdit = (t: Transaction) => console.log('Edit', t)

function formatDateMonth(dateStr: string) { return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase() }
function getDayTotal(transactions: { type: 'income' | 'expense', amount: number }[]) { return transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0) }
</script>
