<template>
  <StandardPageLayout
    title="Meus Orçamentos"
    highlight="Orçamentos"
    subtitle="Defina metas e controle seus gastos mensais."
    :loading="store.isLoading"
  >
    <template #action>
      <div class="flex items-center justify-start md:justify-end gap-3 w-full">
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          class="!rounded-xl px-6 h-10 w-full md:w-auto shadow-lg shadow-violet-500/20"
          @click="showAddBudgetModal = true"
        >
          <template #icon><i class="i-lucide-plus text-lg"></i></template>
          Novo Orçamento
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32 md:pb-0">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 space-y-8 order-2 lg:order-1">
        <BaseSearchInput
          v-model="store.searchQuery"
          placeholder="Buscar por nome do orçamento..."
        />

        <!-- Empty State -->
        <div
          v-if="store.budgets.length === 0 && !store.isLoading && !store.searchQuery"
          class="flex flex-col items-center justify-center py-24 text-center opacity-40 animate-fade-in"
        >
          <div class="w-24 h-24 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-8 text-violet-500">
            <i class="i-lucide-wallet text-5xl"></i>
          </div>
          <h3 class="text-xl font-black uppercase tracking-widest mb-4 text-zinc-800 dark:text-zinc-50">
            Nenhum orçamento
          </h3>
          <p class="text-xs font-bold uppercase tracking-widest text-zinc-400 leading-relaxed max-w-xs mb-8">
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
          <div class="w-20 h-20 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
            <i class="i-lucide-search-x text-4xl text-zinc-400"></i>
          </div>
          <h3 class="text-lg font-black uppercase tracking-widest mb-2 text-zinc-800 dark:text-zinc-50">Nenhum resultado</h3>
          <p class="text-xs font-bold uppercase tracking-widest text-zinc-400">{{ searchEmptySubtitle }}</p>
          <NButton quaternary circle class="mt-8 text-violet-500 font-bold" @click="store.searchQuery = ''">
            Limpar Busca
          </NButton>
        </div>

        <!-- Loading State -->
        <div v-else-if="store.isLoading" class="flex justify-center py-20">
          <i class="i-lucide-loader-2 animate-spin text-4xl text-violet-500"></i>
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
        <BaseCard class="hover-glow">
          <template #header>Visão Geral</template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Total Orçado"
              :value="formatCurrency(store.totalBudgeted)"
              color="#8b5cf6"
              status="info"
            />

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <BaseSummaryItem
              label="Total Consumido"
              :value="formatCurrency(store.totalConsumed)"
              :color="store.totalConsumed > store.totalBudgeted ? '#ef4444' : '#10b981'"
              :status="store.totalConsumed > store.totalBudgeted ? 'error' : 'success'"
            />

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <div class="w-full p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center text-center shadow-inner border border-zinc-200 dark:border-zinc-800">
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Status de Saúde</span>
              <div
                v-if="store.totalConsumed > store.totalBudgeted"
                class="text-red-500 font-black flex items-center gap-2 uppercase text-xs tracking-widest"
              >
                <i class="i-lucide-alert-triangle text-lg"></i>
                Limite Excedido
              </div>
              <div
                v-else
                class="text-emerald-500 font-black flex items-center gap-2 uppercase text-xs tracking-widest"
              >
                <i class="i-lucide-check-circle text-lg"></i>
                Dentro do Planejado
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Insights -->
        <BaseCard class="hover-glow">
          <template #header>Insights de IA</template>
          <div class="flex flex-col gap-4 pt-2">
            <div class="flex gap-4 p-5 rounded-3xl bg-violet-500/5 border border-violet-500/10 relative overflow-hidden group">
              <div class="absolute -right-4 -top-4 w-12 h-12 bg-violet-500/10 blur-2xl rounded-full transition-all group-hover:scale-150"></div>
              <div class="flex flex-col gap-1 relative z-10">
                <p class="text-sm font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Você economizou <span class="text-violet-500 font-black">R$ 340,00</span> em
                  <span class="text-zinc-800 dark:text-zinc-50 font-black">Lazer</span>
                  comparado ao mês passado.
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>

    <BudgetDialog :show="showAddBudgetModal" :budget="selectedBudget" @close="handleCloseModal" />
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { NButton } from 'naive-ui'
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
