<template>
  <StandardPageLayout
    title="Meus Orçamentos"
    highlight="Orçamentos"
    subtitle="Defina metas e controle seus gastos mensais."
    :loading="store.isLoading"
  >
    <template #action>
      <!-- Desktop button moved to sidebar -->
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3" style="gap: var(--space-6); padding-bottom: var(--space-8);">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 order-2 lg:order-1" style="padding: 0 var(--space-6);">
        <div class="flex flex-col gap-4">
          <BaseSearchInput
            v-model="store.searchQuery"
            placeholder="Buscar por nome do orçamento..."
          />

          <!-- Empty State (Cleaned) -->
          <NEmpty
            v-if="store.budgets.length === 0 && !store.isLoading && !store.searchQuery"
            description="Você ainda não criou planejamentos de gastos ou metas de economia."
            class="py-24"
            style="padding-top: var(--space-12); padding-bottom: var(--space-12);"
          >
            <template #icon>
              <i class="i-lucide-IWallet text-5xl text-[rgba(0,122,255,0.3)] dark:text-[rgba(10,132,255,0.3)]"></i>
            </template>
          </NEmpty>

          <!-- Search Empty State -->
          <NEmpty
            v-else-if="filteredBudgets.length === 0 && !store.isLoading && store.searchQuery"
            :description="searchEmptySubtitle"
            class="py-20"
            style="padding-top: var(--space-10); padding-bottom: var(--space-10);"
          >
            <template #icon>
              <i class="i-lucide-search-x text-5xl"></i>
            </template>
            <template #extra>
              <NButton quaternary type="primary" size="small" @click="store.searchQuery = ''">
                Limpar Busca
              </NButton>
            </template>
          </NEmpty>

          <!-- Loading State -->
          <div v-else-if="store.isLoading" class="flex justify-center py-20" style="padding-top: var(--space-10); padding-bottom: var(--space-10); justify-content: center;">
            <NSpin size="large" />
          </div>

          <!-- IBudget List Grid (Max 2 Columns) -->
          <NGrid
            v-else-if="filteredBudgets.length > 0"
            :cols="isMobile ? 1 : 2"
            :x-gap="16"
            :y-gap="16"
          >
            <NGridItem v-for="budget in filteredBudgets" :key="budget.id">
              <BudgetCard
                :budget="budget"
                :consumed="store.getConsumed(budget)"
                :no-hover="showAddBudgetModal"
                @click="handleEditBudget(budget)"
              />
            </NGridItem>
          </NGrid>
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column order-1 lg:order-2">
        <div class="space-y-5" style="gap: var(--space-6);">
          <!-- Overview Card with Button -->
          <div class="sidebar-card overview-card" style="background-color: var(--surface-primary);">
            <div class="overview-header">
              <h3 class="overview-title">Visão Geral</h3>
              <AppleButton
                v-if="!isMobile"
                variant="primary"
                size="small"
                @click="showAddBudgetModal = true"
              >
                <i class="i-lucide-plus mr-1"></i>
                Novo Orçamento
              </AppleButton>
            </div>

            <div class="overview-stats">
              <div class="stat-item">
                <span class="stat-label">Total Orçado</span>
                <div class="stat-value">{{ formatCurrency(store.totalBudgeted) }}</div>
              </div>

              <div class="stat-divider"></div>

              <div class="stat-item">
                <span class="stat-label">Total Consumido</span>
                <div class="stat-value" :class="{ 'stat-value-error': store.totalConsumed > store.totalBudgeted, 'stat-value-success': store.totalConsumed <= store.totalBudgeted }">
                  {{ formatCurrency(store.totalConsumed) }}
                </div>
              </div>
            </div>

            <!-- Health Status -->
            <div class="health-status" :class="{ 'health-status-error': store.totalConsumed > store.totalBudgeted, 'health-status-success': store.totalConsumed <= store.totalBudgeted }">
              <div class="health-icon">
                <i :class="store.totalConsumed > store.totalBudgeted ? 'i-lucide-alert-circle' : 'i-lucide-check-circle'"></i>
              </div>
              <span class="health-text">
                {{ store.totalConsumed > store.totalBudgeted ? 'Limite Excedido' : 'Dentro do Planejado' }}
              </span>
            </div>
          </div>

          <!-- AI Insights -->
          <div class="sidebar-card insights-card" style="background-color: var(--surface-primary);">
            <div class="insights-header">
              <i class="i-lucide-sparkles insights-icon"></i>
              <h3 class="insights-title">Insights de IA</h3>
            </div>
            <div class="insights-content">
              <p class="insights-text">
                Você economizou
                <span class="insights-highlight">R$ 340,00</span>
                em <span class="insights-category">Lazer</span> comparado ao mês passado. Continue assim para atingir sua meta anual mais rápido!
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <BudgetDialog :show="showAddBudgetModal" :budget="selectedBudget" @close="handleCloseModal" />

    <!-- Mobile FAB Button -->
    <div
      v-if="isMobile"
      class="fixed bottom-24 right-6 z-50 md:hidden"
    >
      <AppleButton
        variant="primary"
        size="large"
        @click="showAddBudgetModal = true"
        class="!rounded-full !w-14 !h-14 !p-0 !shadow-lg"
      >
        <i class="i-lucide-plus text-xl"></i>
      </AppleButton>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  NEmpty,
  NSpin,
  NGrid,
  NGridItem,
} from 'naive-ui'
import { useBudgetStore } from '../../application/stores/budgetStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AppleButton from '@/shared/components/apple-ui/AppleButton.vue'
import BudgetCard from '@/shared/components/molecules/BudgetCard.vue'
import BudgetDialog from '../components/BudgetDialog.vue'
import type { IBudget } from '@/modules/budgets/core/entities/IBudget'

const store = useBudgetStore()
const transactionStore = useTransactionStore()
const isMobile = useIsMobile()
const showAddBudgetModal = ref(false)
const selectedBudget = ref<IBudget | null>(null)

const handleEditBudget = (budget: IBudget) => {
  selectedBudget.value = budget
  showAddBudgetModal.value = true
}

const handleCloseModal = () => {
  showAddBudgetModal.value = false
  // Delay clearing the data so the buttons don't disappear during the close animation
  setTimeout(() => {
    selectedBudget.value = null
  }, 300)
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
    await transactionStore.fetchtransactionsByMonth(now.getFullYear(), now.getMonth() + 1)
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

<style scoped>
/* Sidebar Cards */
.sidebar-card {
  border-radius: 16px;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Overview Card */
.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.overview-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.overview-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.stat-value {
  font-size: 28px;
  font-weight: var(--font-bold);
  color: var(--text-label);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.stat-value-success {
  color: var(--color-success);
}

.stat-value-error {
  color: var(--color-error);
}

.stat-divider {
  height: 1px;
  background-color: var(--surface-separator);
}

/* Health Status */
.health-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  background-color: var(--surface-secondary);
}

.health-status-success {
  background-color: rgba(52, 199, 89, 0.1);
}

.health-status-error {
  background-color: rgba(255, 59, 48, 0.1);
}

.health-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.health-icon i {
  font-size: 18px;
}

.health-status-success .health-icon i {
  color: var(--color-success);
}

.health-status-error .health-icon i {
  color: var(--color-error);
}

.health-text {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.health-status-success .health-text {
  color: var(--color-success);
}

.health-status-error .health-text {
  color: var(--color-error);
}

/* Insights Card */
.insights-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.insights-icon {
  font-size: var(--text-base);
  color: var(--color-apple-action);
}

.insights-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.insights-content {
  background-color: var(--color-info-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.insights-text {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-label);
}

.insights-highlight {
  font-weight: var(--font-semibold);
  color: var(--color-apple-action);
}

.insights-category {
  font-weight: var(--font-semibold);
  color: var(--text-label);
}

/* Mobile-first responsive adjustments */
@media (max-width: 640px) {
  .side-column {
    margin-bottom: var(--space-6);
  }
}

/* Tablet and up */
@media (min-width: 641px) {
  .side-column {
    position: sticky;
    top: var(--space-6);
  }
}

/* Ensure touch targets are adequate on mobile */
@media (max-width: 374px) {
  :deep(.n-button) {
    min-height: 44px;
  }
}
</style>
