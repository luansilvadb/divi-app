<template>
  <StandardPageLayout
    title="Meus Orçamentos"
    highlight="Orçamentos"
    subtitle="Defina metas e controle seus gastos mensais."
    :loading="store.isLoading"
  >
    <!-- Header Actions -->
    <template #action>
      <div class="flex items-center justify-start md:justify-end gap-3 w-full">
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          class="!rounded-xl px-6 h-10 w-full md:w-auto"
          @click="showAddBudgetModal = true"
        >
          Novo Orçamento
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32 md:pb-0">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 space-y-8 order-2 lg:order-1">
        <!-- Search Bar -->
        <BaseSearchInput
          v-model="store.searchQuery"
          placeholder="Buscar por nome do orçamento..."
        />

        <!-- Empty State (Matches TransactionsView Style) -->
        <div
          v-if="store.budgets.length === 0 && !store.isLoading && !store.searchQuery"
          class="flex flex-col items-center justify-center py-24 text-center opacity-40 animate-in fade-in zoom-in-95 duration-700"
        >
          <div
            class="w-24 h-24 bg-surface-50 dark:bg-surface-800/10 rounded-full flex items-center justify-center mb-8 text-primary"
          >
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3
            class="text-xl font-black uppercase tracking-[0.2em] mb-4 text-surface-800 dark:text-surface-50"
          >
            Nenhum orçamento
          </h3>
          <p class="text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs mb-8">
            Você ainda não criou planejamentos de gastos ou metas de economia.
          </p>
          <BaseButton
            variant="primary"
            class="!rounded-xl px-8 h-10"
            @click="showAddBudgetModal = true"
          >
            Criar Orçamento
          </BaseButton>
        </div>

        <!-- Search Empty State -->
        <div
          v-else-if="filteredBudgets.length === 0 && !store.isLoading && store.searchQuery"
          class="flex flex-col items-center justify-center py-20 text-center opacity-40"
        >
          <div
            class="w-20 h-20 bg-surface-50 dark:bg-surface-800/10 rounded-full flex items-center justify-center mb-6"
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 class="text-lg font-black uppercase tracking-widest mb-2">Nenhum resultado</h3>
          <p class="text-xs font-bold uppercase tracking-widest">{{ searchEmptySubtitle }}</p>
          <BaseButton
            variant="secondary"
            class="!rounded-xl px-8 mt-8 h-10"
            @click="store.searchQuery = ''"
          >
            Limpar Busca
          </BaseButton>
        </div>

        <!-- Loading State -->
        <div v-else-if="store.isLoading" class="flex flex-col gap-6">
          <!-- Skeleton items could go here if available -->
          <div class="flex justify-center py-20">
            <div
              class="w-8 h-8 border-4 border-primary/20 border-t-primary-main rounded-full animate-spin"
            ></div>
          </div>
        </div>

        <!-- Budget List Grid -->
        <div
          v-else-if="filteredBudgets.length > 0"
          class="budgets-list grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          <BudgetCard
            v-for="budget in filteredBudgets"
            :key="budget.id"
            :budget="budget"
            :consumed="store.getConsumed(budget)"
            @click="handleEditBudget(budget)"
          />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column space-y-8 order-1 lg:order-2">
        <!-- Performance Overview -->
        <BaseCard>
          <template #header>Visão Geral</template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Total Orçado"
              :value="formatCurrency(store.totalBudgeted)"
              color="var(--color-primary-main)"
              status="info"
            />

            <div class="h-px bg-surface-50 dark:bg-surface-800/10"></div>

            <BaseSummaryItem
              label="Total Consumido"
              :value="formatCurrency(store.totalConsumed)"
              :color="
                store.totalConsumed > store.totalBudgeted
                  ? 'var(--color-error-main)'
                  : 'var(--color-success-main)'
              "
              :status="store.totalConsumed > store.totalBudgeted ? 'error' : 'normal'"
            />

            <div class="h-px bg-surface-50 dark:bg-surface-800/10"></div>

            <!-- Health Status Indicator (Standardized Highlight Box) -->
            <div
              class="w-full p-6 rounded-3xl bg-surface-100 dark:bg-surface-950 flex flex-col items-center text-center shadow-inner border border-surface-200 dark:border-surface-200/10"
            >
              <span
                class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 dark:text-surface-400 mb-3"
                >Status de Saúde</span
              >
              <div
                v-if="store.totalConsumed > store.totalBudgeted"
                class="text-error font-black flex items-center gap-2 uppercase text-xs tracking-widest"
              >
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
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Limite Excedido
              </div>
              <div
                v-else
                class="text-success-main font-black flex items-center gap-2 uppercase text-xs tracking-widest"
              >
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
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Dentro do Planejado
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Insights -->
        <BaseCard>
          <template #header>Sinais Relevantes</template>
          <div class="flex flex-col gap-4 pt-2">
            <!-- Insight Item -->
            <div
              class="flex gap-4 p-5 rounded-3xl bg-surface-50 dark:bg-surface-950/50 border border-surface-200 dark:border-surface-800/10 relative overflow-hidden group"
            >
              <!-- Animated Accent Glow -->
              <div
                class="absolute -right-4 -top-4 w-12 h-12 bg-primary/10 blur-2xl rounded-full transition-all group-hover:scale-150"
              ></div>

              <div class="flex flex-col gap-1 relative z-10">
                <span
                  class="text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary opacity-80"
                  >Insight de IA</span
                >
                <p
                  class="text-[0.8rem] font-bold text-surface-600 dark:text-surface-300 leading-relaxed"
                >
                  Você economizou <span class="text-primary font-black">R$ 340,00</span> em
                  <span class="text-surface-900 dark:text-surface-50">Lazer</span>
                  comparado ao mês passado. Ótima performance!
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Budget Dialog -->
    <BudgetDialog :show="showAddBudgetModal" :budget="selectedBudget" @close="handleCloseModal" />
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useBudgetStore } from '../../application/stores/budgetStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import BudgetCard from '@/shared/components/molecules/BudgetCard.vue'
import BudgetDialog from '../components/BudgetDialog.vue'
import type { Budget } from '@/shared/domain/entities/Budget'

const store = useBudgetStore()
const transactionStore = useTransactionStore()
const isMobile = useIsMobile()
const showAddBudgetModal = ref(false)
const selectedBudget = ref<Budget | null>(null)

const handleEditBudget = (budget: Budget) => {
  selectedBudget.value = budget
  showAddBudgetModal.value = true
}

const handleCloseModal = () => {
  showAddBudgetModal.value = false
  selectedBudget.value = null
}

const filteredBudgets = computed(() => {
  if (!store.searchQuery) return store.budgets
  const query = store.searchQuery.toLowerCase()
  return store.budgets.filter((b) => {
    const name = b.name || transactionStore.categoryMap[b.category_id]?.name || ''
    return name.toLowerCase().includes(query)
  })
})

const searchEmptySubtitle = computed(() => {
  return `Não encontramos orçamentos para "${store.searchQuery}"`
})

onMounted(async () => {
  if (transactionStore.transactions.length === 0) {
    const now = new Date()
    await transactionStore.fetchTransactionsByMonth(now.getFullYear(), now.getMonth() + 1)
  }
  if (Object.keys(transactionStore.categoryMap).length === 0) {
    await transactionStore.fetchCategories()
  }
  store.initialize()
})

onUnmounted(() => {
  store.dispose()
})
</script>
