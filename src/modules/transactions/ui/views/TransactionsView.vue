<template>
  <StandardPageLayout
    title="Transações"
    highlight="Histórico"
    subtitle="Acompanhe e gerencie todas as suas movimentações financeiras em um só lugar."
    :loading="store.isLoading"
  >
    <template #action>
      <NSpace align="center" :size="12" class="w-full md:w-auto">
        <BaseMonthSwitcher :month="monthLabelOnly" @prev="prevMonth" @next="nextMonth" />
        <NButton 
          type="primary" 
          @click="openNewForm"
          v-if="!isMobile"
        >
          <template #icon><i class="i-lucide-plus" /></template>
          Adicionar
        </NButton>
      </NSpace>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-32 md:pb-0">
      <!-- MAIN LIST COLUMN -->
      <main class="lg:col-span-2 order-2 lg:order-1">
        <NSpace vertical :size="24">
          <BaseSearchInput v-model="searchQuery" placeholder="Buscar transações..." />

          <!-- Empty State (Cleaned) -->
          <NEmpty
            v-if="Object.keys(groupedTransactions).length === 0"
            description="Nenhuma movimentação encontrada para este período ou pesquisa."
            class="py-20"
          >
            <template #icon>
              <i class="i-lucide-search-x text-5xl text-zinc-300 dark:text-zinc-700"></i>
            </template>
          </NEmpty>

          <!-- Transactions List -->
          <NSpace v-else vertical :size="32">
            <div v-for="(group, day) in groupedTransactions as any" :key="day">
              <NSpace align="center" :size="12" class="mb-4 px-1">
                <NText strong class="text-2xl tabular-nums">
                  {{ String(day).split('-')[2] }}
                </NText>
                <NSpace vertical :size="0">
                  <NText depth="3" class="text-[10px] uppercase tracking-widest">
                    {{ getRelativeDayLabel(String(day)) }}
                  </NText>
                  <NText type="primary" class="text-[10px] font-bold uppercase tracking-widest">
                    {{ formatDateMonth(String(day)) }}
                  </NText>
                </NSpace>
              </NSpace>

              <NSpace vertical :size="8">
                <TransactionItem
                  v-for="t in group.items"
                  :key="t.id"
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
              </NSpace>
            </div>
          </NSpace>
        </NSpace>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column order-1 lg:order-2">
        <NSpace vertical :size="16">
          <NCard>
            <template #header>
              <NSpace justify="space-between" align="center" class="w-full">
                <NText strong>Resumo do Mês</NText>
                <NTag size="small" round :bordered="false">{{ monthLabelOnly }}</NTag>
              </NSpace>
            </template>

            <NSpace vertical :size="16">
              <NStatistic label="Entradas">
                <template #prefix>
                  <NTag type="success" size="small" round :bordered="false">
                    <template #icon><i class="i-lucide-arrow-up-circle text-xs"></i></template>
                  </NTag>
                </template>
                <NText type="success" strong>{{ formatCurrency(store.totalIncome) }}</NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NStatistic label="Saídas">
                <template #prefix>
                  <NTag type="error" size="small" round :bordered="false">
                    <template #icon><i class="i-lucide-arrow-down-circle text-xs"></i></template>
                  </NTag>
                </template>
                <NText type="error" strong>{{ formatCurrency(store.totalExpense) }}</NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NCard embedded size="small" class="text-center">
                <NText depth="3" class="text-xs uppercase tracking-widest block mb-2">Resultado Líquido</NText>
                <NText
                  strong
                  class="text-2xl tabular-nums"
                  :type="store.monthlyBalance >= 0 ? 'primary' : 'error'"
                >
                  {{ formatCurrency(Math.abs(store.monthlyBalance)) }}
                </NText>
              </NCard>
            </NSpace>
          </NCard>

          <NCard>
            <template #header>
              <NText strong>Maiores Gastos</NText>
            </template>

            <NEmpty
              v-if="store.topCategories.length === 0"
              description="Sem dados no período"
              class="py-8"
            >
              <template #icon>
                <i class="i-lucide-pie-chart text-3xl"></i>
              </template>
            </NEmpty>

            <NSpace v-else vertical :size="16">
              <div v-for="cat in store.topCategories" :key="cat.id">
                <NSpace justify="space-between" align="center" class="mb-2">
                  <NSpace align="center" :size="8">
                    <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></div>
                    <NText strong class="text-xs uppercase tracking-wider">{{ cat.name }}</NText>
                  </NSpace>
                  <NText depth="3" class="text-xs tabular-nums">{{ formatCurrency(cat.total) }}</NText>
                </NSpace>
                <NProgress type="line" :percentage="cat.percent" :show-indicator="false" :color="cat.color" :height="5" />
              </div>

              <NButton quaternary block type="primary" size="small">
                Relatórios completos
                <template #icon><i class="i-lucide-arrow-right"></i></template>
              </NButton>
            </NSpace>
          </NCard>
        </NSpace>
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
import {
  NProgress,
  NButton,
  NCard,
  NStatistic,
  NSpace,
  NText,
  NTag,
  NEmpty,
  NDivider,
} from 'naive-ui'
import { useTransactionStore } from '../../application/stores/transactionStore'
import { formatCurrency, getRelativeDayLabel } from '@/shared/utils/formatters'
import { useIsMobile } from '@/shared/composables/useIsMobile'
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
  // Delay clearing the data so the buttons don't disappear during the close animation
  setTimeout(() => {
    editingTransaction.value = null
  }, 300)
}

function formatDateMonth(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
}
</script>
