<template>
  <StandardPageLayout
    title="Transações"
    highlight="Histórico"
    subtitle="Acompanhe e gerencie todas as suas movimentações financeiras em um só lugar."
    :loading="store.isLoading"
  >
    <template #action>
      <div class="flex items-center justify-start md:justify-end gap-3 w-full">
        <BaseMonthSwitcher
          :month="monthLabelOnly"
          class="!max-w-none w-full md:w-auto"
          @prev="prevMonth"
          @next="nextMonth"
        />
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          @click="openNewForm"
          class="!rounded-xl px-6 h-10 shadow-lg shadow-violet-500/20"
        >
          <template #icon><i class="i-lucide-plus text-lg"></i></template>
          Adicionar
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32 md:pb-0">
      <!-- MAIN LIST COLUMN -->
      <main class="lg:col-span-2 space-y-8 order-2 lg:order-1">
        <div class="px-1">
          <BaseSearchInput v-model="searchQuery" placeholder="Buscar transações..." />
        </div>

        <!-- Transactions List -->
        <div
          v-if="Object.keys(groupedTransactions).length === 0"
          class="flex flex-col items-center justify-center py-20 text-center opacity-40 animate-fade-in"
        >
          <div class="w-20 h-20 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
            <i class="i-lucide-search-x text-4xl text-zinc-400"></i>
          </div>
          <h3 class="text-lg font-black uppercase tracking-widest mb-2 text-zinc-800 dark:text-zinc-50">Nenhuma transação</h3>
          <p class="text-xs font-bold uppercase tracking-widest text-zinc-400">Tente mudar o mês ou a pesquisa</p>
        </div>

        <div v-else class="space-y-12">
          <div v-for="(group, day) in groupedTransactions as any" :key="day" class="space-y-4">
            <div class="flex items-center justify-between px-2">
              <div class="flex items-center gap-3">
                <span class="text-2xl font-black tracking-tighter text-zinc-800 dark:text-zinc-50">
                  {{ String(day).split('-')[2] }}
                </span>
                <div class="flex flex-col -space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {{ getRelativeDayLabel(String(day)) }}
                  </span>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">
                    {{ formatDateMonth(String(day)) }}
                  </span>
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
                      ? store.categoryMap[t.category_id]?.color || '#ef4444'
                      : '#10b981'
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
      <aside class="side-column order-1 lg:order-2">
        <BaseCard class="hover-glow">
          <template #header>
            <div class="flex justify-between items-center w-full">
              <span>Resumo do Mês</span>
              <div class="text-[10px] uppercase font-black opacity-40 tracking-widest text-zinc-400">
                {{ monthLabelOnly }}
              </div>
            </div>
          </template>

          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Entradas"
              :value="formatCurrency(store.totalIncome)"
              color="#10b981"
              status="success"
            >
              <template #icon><i class="i-lucide-arrow-up-circle"></i></template>
            </BaseSummaryItem>

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <BaseSummaryItem
              label="Saídas"
              :value="formatCurrency(store.totalExpense)"
              color="#ef4444"
              status="error"
            >
              <template #icon><i class="i-lucide-arrow-down-circle"></i></template>
            </BaseSummaryItem>

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <div class="w-full p-5 rounded-3xl bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center text-center shadow-inner border border-zinc-200 dark:border-zinc-800">
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Resultado Líquido</span>
              <div
                class="text-3xl font-black tracking-tighter"
                :class="store.monthlyBalance >= 0 ? 'text-violet-500' : 'text-red-500'"
              >
                {{ formatCurrency(Math.abs(store.monthlyBalance)) }}
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="hover-glow">
          <template #header>Maiores Gastos</template>

          <div v-if="store.topCategories.length === 0" class="flex flex-col items-center justify-center py-12 opacity-40 text-center">
            <i class="i-lucide-pie-chart text-4xl text-zinc-400 mb-4"></i>
            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sem dados no período</span>
          </div>

          <div v-else class="flex flex-col gap-6 pt-2">
            <div v-for="cat in store.topCategories" :key="cat.id" class="flex flex-col gap-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-full shadow-sm" :style="{ backgroundColor: cat.color }"></div>
                  <span class="text-[11px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-50">{{ cat.name }}</span>
                </div>
                <span class="text-[11px] font-bold tracking-tight text-zinc-400">{{ formatCurrency(cat.total) }}</span>
              </div>
              <NProgress type="line" :percentage="cat.percent" :show-indicator="false" :color="cat.color" :height="6" class="!rounded-full" />
            </div>

            <NButton quaternary class="w-full !text-[10px] uppercase font-black tracking-widest mt-4 text-violet-500">
              Relatórios completos <i class="i-lucide-arrow-right ml-1"></i>
            </NButton>
          </div>
        </BaseCard>
      </aside>
    </div>
    
    <TransactionDialog
      :transaction="editingTransaction"
      :show="showForm"
      @close="handleCloseForm"
      @saved="refreshTransactions"
    />

    <BaseConfirmDialog
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
import { NProgress, NButton } from 'naive-ui'
import { useTransactionStore } from '../../application/stores/transactionStore'
import { formatCurrency, getRelativeDayLabel } from '@/shared/utils/formatters'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import TransactionDialog from '@/shared/components/organisms/TransactionDialog.vue'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseMonthSwitcher from '@/shared/components/molecules/BaseMonthSwitcher.vue'
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

const monthLabelOnly = computed(() => {
  return currentDate.value
    .toLocaleString('pt-BR', { month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase())
})

const groupedTransactions = computed(() => store.groupedTransactions)

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

watch(currentDate, refreshTransactions)

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
  }, 300)
}

function formatDateMonth(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
}
</script>
