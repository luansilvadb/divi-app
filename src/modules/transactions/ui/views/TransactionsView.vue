<template>
  <StandardPageLayout title="Transações" :loading="store.isLoading">
    <!-- Header with Search & Filters -->
    <template #action>
      <div class="flex items-center gap-4 flex-wrap">
        <!-- Month Selector -->
        <div
          class="flex items-center bg-black/5 dark:bg-white/5 rounded-2xl p-1 border border-black/5 dark:border-white/5"
        >
          <Button
            variant="text"
            @click="prevMonth"
            :pt="{
              root: {
                class:
                  'p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-text-secondary border-none',
              },
            }"
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
          </Button>
          <div
            class="px-3 text-[0.7rem] font-black uppercase tracking-widest text-text-primary min-w-[100px] text-center"
          >
            {{ monthLabelOnly }}
          </div>
          <Button
            variant="text"
            @click="nextMonth"
            :pt="{
              root: {
                class:
                  'p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-text-secondary border-none',
              },
            }"
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
          </Button>
        </div>

        <!-- Filter Presets -->
        <div class="flex items-center gap-2">
          <Button
            :label="'Todas'"
            :severity="activeFilter === 'all' ? 'primary' : 'secondary'"
            :text="activeFilter !== 'all'"
            @click="activeFilter = 'all'"
            class="text-xs"
          />
          <Button
            :label="'Entradas'"
            :severity="activeFilter === 'income' ? 'success' : 'secondary'"
            :text="activeFilter !== 'income'"
            @click="activeFilter = 'income'"
            class="text-xs"
          />
          <Button
            :label="'Saídas'"
            :severity="activeFilter === 'expense' ? 'danger' : 'secondary'"
            :text="activeFilter !== 'expense'"
            @click="activeFilter = 'expense'"
            class="text-xs"
          />
        </div>

        <!-- Bulk Mode Toggle & Export -->
        <div class="flex items-center gap-2">
          <Button
            :icon="isBulkMode ? 'pi pi-times' : 'pi pi-check-square'"
            :label="isBulkMode ? 'Cancelar' : 'Selecionar'"
            :severity="isBulkMode ? 'danger' : 'secondary'"
            :text="!isBulkMode"
            @click="toggleBulkMode"
            class="text-xs"
          />
          <Button
            icon="pi pi-download"
            label="Exportar CSV"
            severity="secondary"
            text
            @click="exportToCSV"
            class="text-xs"
          />
        </div>

        <BaseButton v-if="!isMobile" variant="primary" @click="openNewForm"> Adicionar </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN LIST COLUMN -->
      <main class="lg:col-span-2 space-y-8">
        <!-- Bulk Actions Bar -->
        <div
          v-if="isBulkMode"
          class="flex items-center justify-between p-4 bg-primary-main/5 dark:bg-primary-main/10 rounded-2xl border border-primary-main/20"
        >
          <div class="flex items-center gap-3">
            <Button
              label="Selecionar Todas"
              icon="pi pi-check-square"
              text
              size="small"
              @click="selectAll"
            />
            <span class="text-sm font-bold text-text-secondary">
              {{ selectedTransactions.size }} selecionada(s)
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Button
              label="Excluir Selecionadas"
              icon="pi pi-trash"
              severity="danger"
              size="small"
              :disabled="selectedTransactions.size === 0"
              @click="bulkDelete"
            />
            <Button icon="pi pi-times" text size="small" @click="toggleBulkMode" />
          </div>
        </div>

        <!-- Search Bar with AutoComplete -->
        <div class="space-y-3">
          <div class="relative group">
            <!-- Search Icon Overlay -->
            <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-text-disabled group-focus-within:text-primary-main transition-colors duration-300"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            <AutoComplete
              v-model="searchQuery"
              :suggestions="searchSuggestions"
              @complete="searchSuggestionsHandler"
              @option-select="onSearchSelect"
              @clear="onSearchClear"
              placeholder="Buscar transações por título, categoria, carteira..."
              :pt="{
                root: { class: 'w-full' },
                input: {
                  class:
                    'w-full pl-12 pr-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg',
                },
                dropdown: {
                  class:
                    'rounded-r-2xl border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200',
                },
              }"
              dropdown
              class="text-sm"
            />
          </div>

          <!-- Advanced Filters Toggle -->
          <div class="flex items-center gap-2">
            <Button
              :icon="showAdvancedFilters ? 'pi pi-chevron-up' : 'pi pi-filter'"
              :label="showAdvancedFilters ? 'Ocultar Filtros' : 'Filtros Avançados'"
              text
              size="small"
              @click="showAdvancedFilters = !showAdvancedFilters"
              class="text-xs transition-all duration-200 hover:scale-105"
            />
            <Button
              v-if="searchHistory.length > 0"
              icon="pi pi-history"
              label="Limpar Histórico"
              text
              size="small"
              @click="handleClearSearchHistory"
              class="text-xs text-text-disabled hover:text-text-secondary transition-colors duration-200"
            />
          </div>

          <!-- Advanced Filters Panel -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="showAdvancedFilters"
              class="p-5 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl space-y-4 border border-black/5 dark:border-white/5 shadow-lg"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Category Filter -->
                <div class="space-y-2">
                  <label class="text-xs font-bold text-text-secondary uppercase tracking-wider"
                    >Categoria</label
                  >
                  <select
                    v-model="filterCategory"
                    class="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 transition-all duration-200 hover:border-black/20 dark:hover:border-white/20"
                  >
                    <option value="">Todas</option>
                    <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>

                <!-- Wallet Filter -->
                <div class="space-y-2">
                  <label class="text-xs font-bold text-text-secondary uppercase tracking-wider"
                    >Carteira</label
                  >
                  <select
                    v-model="filterWallet"
                    class="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 transition-all duration-200 hover:border-black/20 dark:hover:border-white/20"
                  >
                    <option value="">Todas</option>
                    <option v-for="wallet in store.wallets" :key="wallet.id" :value="wallet.id">
                      {{ wallet.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Amount Range -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-text-secondary uppercase tracking-wider"
                    >Valor Mínimo</label
                  >
                  <input
                    v-model.number="filterAmountMin"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    class="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 transition-all duration-200 hover:border-black/20 dark:hover:border-white/20"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-text-secondary uppercase tracking-wider"
                    >Valor Máximo</label
                  >
                  <input
                    v-model.number="filterAmountMax"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="∞"
                    class="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-main/30 focus:border-primary-main/50 transition-all duration-200 hover:border-black/20 dark:hover:border-white/20"
                  />
                </div>
              </div>

              <!-- Clear Filters -->
              <div class="flex justify-end pt-2">
                <Button
                  label="Limpar Filtros"
                  icon="pi pi-times"
                  text
                  size="small"
                  @click="
                    filterCategory = ''
                    filterWallet = ''
                    filterAmountMin = null
                    filterAmountMax = null
                  "
                  class="hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Transactions List -->
        <div
          v-if="Object.keys(filteredGroupedTransactions).length === 0"
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
          <div
            v-for="(group, day) in filteredGroupedTransactions as any"
            :key="day"
            class="space-y-4"
          >
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
              <div v-for="t in group.items" :key="t.id" class="relative">
                <!-- Checkbox for bulk selection -->
                <div v-if="isBulkMode" class="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                  <Checkbox
                    :modelValue="selectedTransactions.has(t.id)"
                    @update:modelValue="toggleTransactionSelection(t.id)"
                    :binary="true"
                  />
                </div>
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
                  :class="{ 'ml-10': isBulkMode }"
                  showTime
                  @delete="handleDelete"
                  @click="isBulkMode ? toggleTransactionSelection(t.id) : handleEdit(t)"
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
      <TransactionDialog
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

      <!-- Toast Notifications -->
      <Toast />

      <!-- Floating Action Button (FAB) -->
      <BaseButton
        v-if="isMobile"
        variant="primary"
        :pt="{
          root: {
            class:
              'fixed bottom-24 right-6 md:bottom-10 md:right-10 !w-14 !h-14 !rounded-full !p-0 flex items-center justify-center shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:-translate-y-1 transition-all z-50',
          },
        }"
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
      </BaseButton>
    </Teleport>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useTransactionStore } from '../../application/stores/transactionStore'
import {
  formatCurrency,
  formatCurrencySign,
  getRelativeDayLabel,
  formatMonthLong,
  formatMonthShort,
} from '@/shared/utils/formatters'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import TransactionDialog from '@/shared/components/organisms/TransactionDialog.vue'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'
import TransactionItem from '../components/TransactionItem.vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import AutoComplete from 'primevue/autocomplete'
import { useToast } from 'primevue/usetoast'
import { searchTransactions, getSearchSuggestions } from '../../utils/search'
import { getSearchHistory, addToSearchHistory, clearSearchHistory } from '../../utils/searchHistory'

const store = useTransactionStore()
const toast = useToast()
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

// Search state
const searchQuery = ref('')
const searchSuggestions = ref<string[]>([])
const searchHistory = ref<string[]>(getSearchHistory())

// Bulk selection state
const selectedTransactions = ref<Set<string>>(new Set())
const isBulkMode = ref(false)

// Filter presets state
const activeFilter = ref<'all' | 'income' | 'expense'>('all')

// Advanced filters state
const showAdvancedFilters = ref(false)
const filterCategory = ref<string | undefined>('')
const filterWallet = ref<string | undefined>('')
const filterAmountMin = ref<number | null>(null)
const filterAmountMax = ref<number | null>(null)

// Search context for multi-field search
const searchContext = computed(() => ({
  transactions: store.transactions || [],
  categoryMap: store.categoryMap || {},
  walletMap: store.walletMap || {},
}))

// Search suggestions for AutoComplete
function searchSuggestionsHandler(event: { query: string }) {
  const query = event.query

  if (!query || query.trim().length < 2) {
    // Show search history when query is empty
    searchSuggestions.value = [...searchHistory.value]
    return
  }

  // Get suggestions from search utility
  const suggestions = getSearchSuggestions(query, searchContext.value)

  // Add matching history entries
  const historyMatches = searchHistory.value.filter((h) =>
    h.toLowerCase().includes(query.toLowerCase()),
  )

  searchSuggestions.value = [...new Set([...suggestions, ...historyMatches])].slice(0, 10)
}

function onSearchSelect(event: { value: string }) {
  searchQuery.value = event.value
  addToSearchHistory(event.value)
}

function onSearchClear() {
  searchQuery.value = ''
  searchSuggestions.value = []
}

function handleClearSearchHistory() {
  clearSearchHistory()
  searchHistory.value = []
}

// Date Labels
const monthLabelOnly = computed(() => {
  return formatMonthLong(currentDate.value)
})

// Grouping Logic: Moved to store for performance
const groupedTransactions = computed(() => store.groupedTransactions)

// Apply search and filters to grouped transactions
const filteredGroupedTransactions = computed(() => {
  let transactions = store.transactions

  // Apply type filter
  if (activeFilter.value !== 'all') {
    transactions = transactions.filter((t) =>
      activeFilter.value === 'income' ? t.type === 'income' : t.type === 'expense',
    )
  }

  // Apply advanced filters
  if (filterCategory.value && filterCategory.value !== '') {
    transactions = transactions.filter((t) => t.category_id === filterCategory.value)
  }

  if (filterWallet.value && filterWallet.value !== '') {
    transactions = transactions.filter((t) => {
      if (!t.wallet_id) return false
      return t.wallet_id === filterWallet.value
    })
  }

  if (filterAmountMin.value !== null) {
    transactions = transactions.filter((t) => t.amount >= filterAmountMin.value!)
  }

  if (filterAmountMax.value !== null) {
    transactions = transactions.filter((t) => t.amount <= filterAmountMax.value!)
  }

  // Apply search using utility
  if (searchQuery.value && searchQuery.value.trim()) {
    const searchResult = searchTransactions(searchQuery.value, {
      transactions,
      categoryMap: store.categoryMap || {},
      walletMap: store.walletMap || {},
    })
    transactions = searchResult
  }

  // Re-group filtered transactions
  const grouped: Record<string, { items: Transaction[] }> = {}
  for (const t of transactions) {
    if (!t.date) continue
    const dateKey = new Date(t.date + 'T12:00:00').toISOString().split('T')[0] as string
    if (!grouped[dateKey]) {
      grouped[dateKey] = { items: [] }
    }
    grouped[dateKey].items.push(t)
  }

  return grouped
})

// Bulk actions
function toggleBulkMode() {
  isBulkMode.value = !isBulkMode.value
  if (!isBulkMode.value) {
    selectedTransactions.value.clear()
  }
}

function toggleTransactionSelection(id: string) {
  if (selectedTransactions.value.has(id)) {
    selectedTransactions.value.delete(id)
  } else {
    selectedTransactions.value.add(id)
  }
}

function selectAll() {
  const allIds = Object.values(
    groupedTransactions.value as Record<string, { items: Transaction[] }>,
  ).flatMap((group) => group.items.map((t) => t.id))
  selectedTransactions.value = new Set(allIds)
}

function clearSelection() {
  selectedTransactions.value.clear()
}

async function bulkDelete() {
  if (selectedTransactions.value.size === 0) return

  for (const id of selectedTransactions.value) {
    await store.deleteTransaction(id)
  }

  toast.add({
    severity: 'success',
    summary: 'Transações excluídas',
    detail: `${selectedTransactions.value.size} transações foram excluídas`,
    life: 3000,
  })

  selectedTransactions.value.clear()
  isBulkMode.value = false
}

// CSV Export
function exportToCSV() {
  const allTransactions = Object.values(
    groupedTransactions.value as Record<string, { items: Transaction[] }>,
  ).flatMap((group) => group.items)

  if (allTransactions.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Sem dados',
      detail: 'Não há transações para exportar',
      life: 3000,
    })
    return
  }

  const headers = ['Data', 'Título', 'Categoria', 'Carteira', 'Tipo', 'Valor']
  const rows = allTransactions.map((t) => [
    new Date(t.date).toLocaleDateString('pt-BR'),
    t.title || 'Sem título',
    store.categoryMap[t.category_id]?.name || 'Outros',
    store.walletMap[t.wallet_id]?.name || 'Carteira',
    t.type === 'income' ? 'Entrada' : 'Saída',
    t.amount.toFixed(2),
  ])

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `transacoes_${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}.csv`
  link.click()
  URL.revokeObjectURL(url)

  toast.add({
    severity: 'success',
    summary: 'Exportação concluída',
    detail: `Arquivo CSV gerado com ${allTransactions.length} transações`,
    life: 3000,
  })
}

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
  return formatMonthShort(date)
}
</script>
