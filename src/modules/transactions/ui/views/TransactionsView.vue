<template>
  <StandardPageLayout
    :title="messages.MSG_I_VIEW_TX_TITLE"
    :highlight="messages.MSG_I_VIEW_TX_HIGHLIGHT"
    :subtitle="messages.MSG_I_VIEW_TX_SUBTITLE"
    :loading="store.isLoading"
  >
    <template #action>
      <!-- Month switcher moved to sidebar panel -->
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-32 md:pb-0">
      <!-- MAIN LIST COLUMN -->
      <main class="lg:col-span-2 order-2 lg:order-1">
        <NSpace vertical :size="24">
          <BaseSearchInput v-model="searchQuery" :placeholder="messages.MSG_I_SEARCH_TX" />

          <!-- Empty State (Cleaned) -->
          <NEmpty
            v-if="Object.keys(groupedtransactions).length === 0"
            :description="messages.MSG_I_EMPTY_TX"
            class="py-20"
          >
            <template #icon>
              <i class="i-lucide-search-x text-5xl text-zinc-300 dark:text-zinc-700"></i>
            </template>
          </NEmpty>

          <!-- transactions List -->
          <NSpace v-else vertical :size="32">
            <div v-for="(group, day) in groupedtransactions as any" :key="day">
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
                <ITransactionItem
                  v-for="t in group.items"
                  :key="t.id"
                  :ITransaction="t"
                  :categoryName="store.categoryMap[t.category_id]?.name || 'Outros'"
                  :categoryColor="
                    t.type === 'expense'
                      ? store.categoryMap[t.category_id]?.color || '#ef4444'
                      : '#10b981'
                  "
                  :categoryIcon="store.categoryMap[t.category_id]?.icon"
                  :IWalletName="store.IWalletMap[t.wallet_id]?.name || 'Carteira'"
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
        <!-- Apple-Style Summary Panel -->
        <div class="bg-white rounded-[18px] p-5 xl:p-6 shadow-sm">
          <!-- Header with Month Switcher and Action Button -->
          <div class="flex items-center justify-between mb-5 xl:mb-6">
            <h3 class="text-[#1d1d1f] font-sf-display font-semibold text-base xl:text-lg">{{ messages.MSG_I_MONTH_SUMMARY }}</h3>
            <div class="flex items-center gap-2 xl:gap-3">
              <BaseMonthSwitcher :month="monthLabelOnly" @prev="prevMonth" @next="nextMonth" />
              <AppleButton
                v-if="!isMobile"
                variant="primary"
                size="medium"
                @click="openNewForm"
                class="!px-4 xl:!px-5 !py-2 xl:!py-2.5"
              >
                {{ messages.MSG_I_ADD }}
              </AppleButton>
            </div>
          </div>

          <!-- Income & Expense Stats -->
          <div class="space-y-5 xl:space-y-6">
            <!-- Income -->
            <div>
              <p class="text-[#6e6e73] text-[11px] xl:text-xs font-sf-text font-semibold uppercase tracking-wider mb-1.5 xl:mb-2">{{ messages.MSG_I_INCOME }}</p>
              <div class="flex items-center gap-2.5 xl:gap-3">
                <div class="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <i class="i-lucide-arrow-up-circle text-sm xl:text-base text-green-500"></i>
                </div>
                <span class="text-green-500 font-sf-display font-semibold text-xl xl:text-2xl tabular-nums">
                  {{ formatCurrency(store.totalIncome) }}
                </span>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-px bg-[#d2d2d7]" />

            <!-- Expense -->
            <div>
              <p class="text-[#6e6e73] text-[11px] xl:text-xs font-sf-text font-semibold uppercase tracking-wider mb-1.5 xl:mb-2">{{ messages.MSG_I_EXPENSE }}</p>
              <div class="flex items-center gap-2.5 xl:gap-3">
                <div class="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <i class="i-lucide-arrow-down-circle text-sm xl:text-base text-red-500"></i>
                </div>
                <span class="text-red-500 font-sf-display font-semibold text-xl xl:text-2xl tabular-nums">
                  {{ formatCurrency(store.totalExpense) }}
                </span>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-px bg-[#d2d2d7]" />

            <!-- Net Balance -->
            <div class="bg-[#f5f5f7] rounded-[12px] p-4 xl:p-5 text-center">
              <p class="text-[#6e6e73] text-[9px] xl:text-[10px] font-sf-text font-semibold uppercase tracking-widest mb-1.5 xl:mb-2">{{ messages.MSG_I_NET_BALANCE }}</p>
              <span
                class="font-sf-display font-semibold text-xl xl:text-2xl tabular-nums"
                :class="store.monthlyBalance >= 0 ? 'text-green-500' : 'text-red-500'"
              >
                {{ formatCurrency(Math.abs(store.monthlyBalance)) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Top Expenses Panel -->
        <div class="bg-white rounded-[18px] p-5 xl:p-6 shadow-sm mt-4 xl:mt-5">
          <h3 class="text-[#1d1d1f] font-sf-display font-semibold text-sm xl:text-base mb-4 xl:mb-5">{{ messages.MSG_I_TOP_EXPENSES }}</h3>

          <div v-if="store.topCategories.length === 0" class="text-center py-8 xl:py-10">
            <i class="i-lucide-pie-chart text-3xl xl:text-4xl text-[#d2d2d7] mb-2 xl:mb-3"></i>
            <p class="text-[#6e6e73] text-sm xl:text-base">{{ messages.MSG_I_NO_DATA_PERIOD }}</p>
          </div>

          <div v-else class="space-y-4 xl:space-y-5">
            <div v-for="cat in store.topCategories" :key="cat.id">
              <div class="flex items-center justify-between mb-2 xl:mb-2.5">
                <div class="flex items-center gap-2 xl:gap-2.5">
                  <div class="w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full" :style="{ backgroundColor: cat.color }"></div>
                  <span class="text-[#1d1d1f] text-[11px] xl:text-xs font-sf-text font-semibold uppercase tracking-wider">{{ cat.name }}</span>
                </div>
                <span class="text-[#6e6e73] text-[11px] xl:text-xs tabular-nums font-medium">{{ formatCurrency(cat.total) }}</span>
              </div>
              <div class="h-[5px] xl:h-[6px] bg-[#f5f5f7] rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-150 ease-out"
                  :style="{ width: `${cat.percent}%`, backgroundColor: cat.color }"
                />
              </div>
            </div>

            <button class="w-full flex items-center justify-center gap-2 text-[#0066cc] text-sm xl:text-base font-sf-text font-medium py-2.5 xl:py-3 hover:bg-[#f5f5f7] rounded-[8px] transition-colors mt-2">
              {{ messages.MSG_I_FULL_REPORTS }}
              <i class="i-lucide-arrow-right text-xs xl:text-sm"></i>
            </button>
          </div>
        </div>
      </aside>
    </div>

    <ITransactionDialog
      :ITransaction="editingITransaction"
      :show="showForm"
      @close="handleCloseForm"
      @saved="refreshtransactions"
    />

    <BaseConfirmDialog
      :show="showConfirmDelete"
      :title="messages.MSG_ACT_TX_DELETED"
      :message="messages.MSG_A_DELETE_CONFIRM"
      confirm-text="Excluir"
      cancel-text="Cancelar"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Mobile FAB Button -->
    <div
      v-if="isMobile"
      class="fixed bottom-24 right-6 z-50 md:hidden"
    >
      <AppleButton
        variant="primary"
        size="large"
        @click="openNewForm"
        class="!rounded-full !w-14 !h-14 !p-0 !shadow-lg"
      >
        <i class="i-lucide-plus text-xl"></i>
      </AppleButton>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import {
  NSpace,
  NText,
  NEmpty,
} from 'naive-ui'
import { usetransactionstore } from '../../application/stores/transactionstore'
import { formatCurrency, getRelativeDayLabel } from '@/shared/utils/formatters'
import { messages } from '@/shared/messages/catalog'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import ITransactionDialog from '@/shared/components/organisms/ITransactionDialog.vue'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseMonthSwitcher from '@/shared/components/molecules/BaseMonthSwitcher.vue'
import ITransactionItem from '../components/ITransactionItem.vue'
import AppleButton from '@/shared/components/apple-ui/AppleButton.vue'
import type { ITransaction } from '@/modules/transactions/core/entities/ITransaction'

const store = usetransactionstore()
const isMobile = useIsMobile()
const showForm = ref(false)
const editingITransaction = ref<ITransaction | null>(null)
const openNewForm = () => {
  editingITransaction.value = null
  showForm.value = true
}

const showConfirmDelete = ref(false)
const ITransactionToDelete = ref<string | null>(null)
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

const groupedtransactions = computed(() => store.groupedtransactions)

onMounted(async () => {
  if (store.wallets.length === 0) await store.fetchwallets()
  if (store.categories.length === 0) await store.fetchCategories()
  await refreshtransactions()
})

async function refreshtransactions() {
  await store.fetchtransactionsByMonth(
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

watch(currentDate, refreshtransactions)

const handleDelete = (id: string) => {
  ITransactionToDelete.value = id
  showConfirmDelete.value = true
}

const confirmDelete = async () => {
  if (ITransactionToDelete.value) {
    await store.deleteITransaction(ITransactionToDelete.value)
    showConfirmDelete.value = false
    ITransactionToDelete.value = null
  }
}

const cancelDelete = () => {
  showConfirmDelete.value = false
  ITransactionToDelete.value = null
}

const handleEdit = (ITransaction: ITransaction) => {
  editingITransaction.value = ITransaction
  showForm.value = true
}

const handleCloseForm = () => {
  showForm.value = false
  // Delay clearing the data so the buttons don't disappear during the close animation
  setTimeout(() => {
    editingITransaction.value = null
  }, 300)
}

function formatDateMonth(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
}
</script>
