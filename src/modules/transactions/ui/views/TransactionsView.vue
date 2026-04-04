<template>
  <StandardPageLayout title="Transações" :loading="store.isLoading">
    <!-- Header with Search & Filters -->
    <template #action>
      <div class="flex items-center gap-4">
        <!-- Month Selector -->
        <div
          class="flex items-center bg-black/5 dark:bg-white/5 rounded-2xl p-1 border border-black/5 dark:border-white/5"
        >
          <button
            @click="prevMonth"
            class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-text-secondary"
          >
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
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div
            class="px-3 text-[0.7rem] font-black uppercase tracking-widest text-text-primary min-w-[100px] text-center"
          >
            {{ monthLabelOnly }}
          </div>
          <button
            @click="nextMonth"
            class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-text-secondary"
          >
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <BaseButton v-if="!isMobile" variant="primary" @click="openNewForm"> Adicionar </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN LIST COLUMN -->
      <main class="lg:col-span-2 space-y-8">
        <!-- Search Bar -->
        <div class="relative group">
          <div
            class="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-disabled group-focus-within:text-primary-main transition-colors"
          >
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Pesquisar por título, categoria ou valor..."
            class="w-full bg-white dark:bg-black/20 border-2 border-black/5 dark:border-white/5 rounded-3xl py-4 pl-14 pr-6 text-sm font-medium focus:border-primary-main focus:ring-4 focus:ring-primary-main/10 outline-hidden transition-all shadow-sm"
          />
        </div>

        <!-- Transactions List -->
        <div
          v-if="Object.keys(groupedTransactions).length === 0"
          class="flex flex-col items-center justify-center py-20 text-center opacity-40"
        >
          <div
            class="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3 class="text-lg font-black uppercase tracking-widest mb-2">Nenhuma transação</h3>
          <p class="text-xs font-bold uppercase tracking-widest">Tente mudar o mês ou a pesquisa</p>
        </div>

        <div v-else class="space-y-12">
          <div v-for="(group, day) in groupedTransactions as any" :key="day" class="space-y-4">
            <div class="flex items-center justify-between px-2">
              <div class="flex items-center gap-3">
                <span class="text-2xl font-black tracking-tighter text-text-primary">{{
                  String(day).split('-')[2]
                }}</span>
                <div class="flex flex-col -space-y-1">
                  <span
                    class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
                    >{{ getRelativeDayLabel(String(day)) }}</span
                  >
                  <span
                    class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-main"
                    >{{ formatDateMonth(String(day)) }}</span
                  >
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div v-for="t in group.items" :key="t.id">
                <TransactionItem
                  :transaction="t"
                  :categoryName="store.categoryMap[t.category_id]?.name || 'Outros'"
                  :categoryColor="
                    t.type === 'expense'
                      ? store.categoryMap[t.category_id]?.color || 'var(--color-error-main)'
                      : 'var(--color-primary-main)'
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
    <!-- Overlays and Modals -->
    <Teleport to="body">
      <!-- Transaction Form Overlay -->
      <component
        :is="isMobile ? TransactionBottomSheet : TransactionModal"
        :transaction="editingTransaction"
        :show="showForm"
        @close="handleCloseForm"
        @saved="refreshTransactions"
      />

      <!-- Delete Confirmation Overlay -->
      <BaseConfirmDialog
        :show="showConfirmDelete"
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação? Esta ação não poderá ser desfeita."
        confirm-text="Excluir"
        cancel-text="Cancelar"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />

      <!-- Floating Action Button (FAB) -->
      <button
        v-if="isMobile"
        class="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 rounded-full bg-primary-main text-white flex items-center justify-center shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:bg-primary-dark hover:-translate-y-1 transition-all z-50 active:scale-95"
        @click="openNewForm()"
        aria-label="Nova Transação"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </Teleport>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useTransactionStore } from '../../application/stores/transactionStore'
import { formatCurrency, formatCurrencySign, getRelativeDayLabel } from '@/shared/utils/formatters'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import TransactionBottomSheet from '@/shared/components/organisms/TransactionBottomSheet.vue'
import TransactionModal from '@/shared/components/organisms/TransactionModal.vue'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'
import TransactionItem from '../components/TransactionItem.vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'

const store = useTransactionStore()
const isMobile = useIsMobile()
const showForm = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const openNewForm = () => {
  editingTransaction.value = null
  showForm.value = true
}

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
  editingTransaction.value = transaction
  showForm.value = true
}

const handleCloseForm = () => {
  showForm.value = false
  setTimeout(() => {
    editingTransaction.value = null
  }, 300) // Clear after animation
}

// Formatting Helper (Day Label)
function formatDateMonth(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
}
</script>
