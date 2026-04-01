<template>
  <StandardPageLayout
    title="Seu Fluxo Financeiro"
    highlight="Fluxo"
    subtitle="Domine seus hábitos com clareza total. Cada movimento conta uma história."
  >
    <template #action>
      <BaseButton variant="primary" @click="showForm = true"> Nova Transação </BaseButton>
    </template>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN: Actions + List -->
      <main class="main-column">
        <!-- Tools & Filtering -->
        <div
          class="p-4 flex flex-wrap items-center justify-between gap-4 glass-card bg-surface-main shadow-sm mb-8"
        >
          <!-- Month Selector -->
          <div
            class="flex items-center bg-black/5 dark:bg-black/20 p-1.5 rounded-[1.5rem] border border-black/5 dark:border-white/5"
          >
            <button
              aria-label="Mês anterior"
              class="h-11 w-11 flex items-center justify-center rounded-2xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all active:scale-95"
              @click="prevMonth"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div class="px-8 flex flex-col items-center min-w-[150px]">
              <span
                class="text-[9px] font-black uppercase tracking-[0.2em] text-text-disabled leading-none mb-1.5"
              >
                {{ currentDate.getFullYear() }}
              </span>
              <span class="text-sm font-black uppercase tracking-widest text-text-primary">
                {{ monthLabelOnly }}
              </span>
            </div>
            <button
              aria-label="Próximo mês"
              class="h-11 w-11 flex items-center justify-center rounded-2xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all active:scale-95"
              @click="nextMonth"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
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
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
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
              aria-label="Buscar transações"
              placeholder="Buscar transações..."
              class="w-full pl-12 pr-4 h-14 bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-[1.5rem] text-sm font-bold placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-main/20 transition-all text-text-primary"
            />
          </div>
        </div>

        <!-- Transactions List -->
        <div class="space-y-6">
          <div
            v-if="store.isLoading"
            class="flex flex-col items-center justify-center py-20 opacity-50 glass-card"
          >
            <div
              class="w-8 h-8 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin mb-4"
            ></div>
            <span class="text-xs font-black uppercase tracking-widest">Sincronizando...</span>
          </div>

          <BaseCard
            v-else-if="Object.keys(groupedTransactions).length === 0"
            is-empty
            empty-title="Nenhuma transação"
            empty-subtitle="Você não tem movimentos registrados neste período."
            empty-color="var(--color-primary-main)"
          >
            <template #empty-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </template>
            <template #empty-action>
              <BaseButton variant="primary" class="px-8 mt-4" @click="showForm = true">
                Adicionar Agora
              </BaseButton>
            </template>
          </BaseCard>

          <!-- Grouped by Date -->
          <div v-else class="space-y-10">
            <div v-for="(group, dateKey) in groupedTransactions" :key="dateKey" class="space-y-4">
              <!-- Date Header -->
              <div class="flex items-center justify-between px-1">
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 rounded-2xl bg-surface-main dark:bg-white/5 flex flex-col items-center justify-center leading-none shadow-sm border border-black/5 dark:border-white/5"
                  >
                    <span
                      class="text-[9px] font-black uppercase tracking-widest text-text-disabled mb-0.5"
                      >{{ formatDateMonth(dateKey) }}</span
                    >
                    <span class="text-base font-black text-text-primary">{{
                      dateKey.split('-')[2]
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-text-primary tracking-tight">{{
                      getRelativeDayLabel(dateKey)
                    }}</span>
                    <span class="text-[10px] font-bold text-text-disabled uppercase tracking-widest"
                      >{{ group.items.length }}
                      {{ group.items.length === 1 ? 'transação' : 'transações' }}</span
                    >
                  </div>
                </div>

                <div
                  class="text-sm font-black tracking-tighter bg-surface-main dark:bg-white/5 px-4 py-2 rounded-xl shadow-sm border border-black/5 dark:border-white/5"
                  :class="group.total >= 0 ? 'text-success-main' : 'text-error-main'"
                >
                  <span class="text-[10px] uppercase opacity-40 mr-1.5 font-bold"
                    >Saldo do dia:</span
                  >
                  {{ formatCurrencySign(group.total) }}
                </div>
              </div>

              <!-- Transaction Items -->
              <div class="flex flex-col gap-2">
                <TransactionItem
                  v-for="t in group.items"
                  :key="t.id || t.localId"
                  :transaction="t"
                  :categoryName="store.categoryMap[t.category_id]?.name || 'Outras'"
                  :categoryColor="
                    store.categoryMap[t.category_id]?.color || 'var(--color-primary-main)'
                  "
                  :categoryIcon="store.categoryMap[t.category_id]?.icon"
                  :walletName="store.walletMap[t.wallet_id]?.name || 'Carteira'"
                  showTime
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

    <TransactionBottomSheet
      v-if="isMobile"
      :show="showForm"
      @close="showForm = false"
      @saved="refreshTransactions"
    />
    <TransactionModal
      v-else-if="showForm"
      :show="showForm"
      @close="showForm = false"
      @saved="refreshTransactions"
    />

    <BaseConfirmModal
      :show="showConfirmDelete"
      title="Excluir Transação"
      message="Tem certeza que deseja excluir esta transação? Esta ação não poderá ser desfeita."
      confirm-text="Excluir"
      cancel-text="Cancelar"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useTransactionStore } from '../../application/stores/transactionStore'
import { formatCurrency, formatCurrencySign, getRelativeDayLabel } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import TransactionBottomSheet from '@/shared/components/organisms/TransactionBottomSheet.vue'
import TransactionModal from '@/shared/components/organisms/TransactionModal.vue'
import BaseConfirmModal from '@/shared/components/molecules/BaseConfirmModal.vue'
import TransactionItem from '../components/TransactionItem.vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'

const store = useTransactionStore()
const showForm = ref(false)
const isMobile = useMediaQuery('(max-width: 768px)')
const showConfirmDelete = ref(false)
const transactionToDelete = ref<string | null>(null)
const currentDate = ref(new Date())
const searchQuery = computed({
  get: () => store.searchQuery,
  set: (val) => {
    store.searchQuery = val
  },
})

// Date Labels
const monthLabelOnly = computed(() => {
  return currentDate.value
    .toLocaleString('pt-BR', { month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase())
})

// Grouping Logic: Moved to store for performance
const groupedTransactions = computed(() => store.groupedTransactions)

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
const handleDelete = (id: string) => {
  transactionToDelete.value = id
  showConfirmDelete.value = true
}

const confirmDelete = async () => {
  if (transactionToDelete.value) {
    await store.deleteTransaction(transactionToDelete.value)
    showConfirmDelete.value = false
    transactionToDelete.value = null
  }
}

const cancelDelete = () => {
  showConfirmDelete.value = false
  transactionToDelete.value = null
}

const handleEdit = (transaction: Transaction) => {
  console.log('Edit', transaction)
}

// Formatting Helper (Day Label)
function formatDateMonth(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
}
</script>
