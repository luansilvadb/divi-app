<template>
  <StandardPageLayout
    title="Gestão de Orçamentos"
    highlight="Orçamentos"
    subtitle="Defina limites, controle gastos e economize para o que realmente importa."
  >
    <template #action>
      <BaseButton variant="primary" @click="showAddBudgetModal = true"> Novo Orçamento </BaseButton>
    </template>

    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <!-- Search Bar -->
        <div v-if="store.budgets.length > 0 || store.searchQuery" class="mb-4">
          <BaseSearchInput
            v-model="store.searchQuery"
            placeholder="Buscar por nome do orçamento..."
            :debounce="300"
            :loading="store.isLoading"
          />
        </div>

        <!-- Empty State (No budgets at all) -->
        <BaseCard
          v-if="store.budgets.length === 0 && !store.isLoading && !store.searchQuery"
          is-empty
          empty-title="Nenhum orçamento"
          empty-subtitle="Você ainda não criou planejamentos de gastos ou metas de economia."
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </template>
          <template #empty-action>
            <BaseButton variant="primary" class="px-8 mt-4" @click="showAddBudgetModal = true">
              Criar Primeiro Orçamento
            </BaseButton>
          </template>
        </BaseCard>

        <!-- Search Empty State -->
        <BaseCard
          v-else-if="filteredBudgets.length === 0 && !store.isLoading && store.searchQuery"
          is-empty
          empty-title="Nenhum resultado"
          :empty-subtitle="searchEmptySubtitle"
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </template>
          <template #empty-action>
            <BaseButton variant="secondary" class="px-8 mt-4" @click="store.searchQuery = ''">
              Limpar Busca
            </BaseButton>
          </template>
        </BaseCard>

        <!-- Loading State -->
        <div v-else-if="store.isLoading" class="flex justify-center py-20">
          <div
            class="w-8 h-8 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin"
          ></div>
        </div>

        <!-- Budget List Grid -->
        <div
          v-else-if="filteredBudgets.length > 0"
          class="budgets-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6"
        >
          <BudgetCard
            v-for="budget in filteredBudgets"
            :key="budget.id"
            :budget="budget"
            :consumed="store.getConsumed(budget)"
          />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
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

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

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

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <div
              class="w-full p-5 rounded-3xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center border border-black/5 dark:border-white/5"
            >
              <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-2"
                >Status de Saúde</span
              >
              <div
                v-if="store.totalConsumed > store.totalBudgeted"
                class="text-error-main font-black flex items-center gap-2"
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
                Atenção: Limite Excedido
              </div>
              <div v-else class="text-success-main font-black flex items-center gap-2">
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
          <template #header>Insights</template>
          <div class="p-2 space-y-4">
            <div class="flex gap-4">
              <div
                class="w-8 h-8 rounded-lg bg-accent-main/10 text-accent-main flex-shrink-0 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <p class="text-xs font-bold text-text-secondary leading-relaxed">
                Você economizou <span class="text-text-primary">R$ 340,00</span> em Lazer comparado
                ao mês passado. Bom trabalho!
              </p>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Future: BudgetForm Component -->
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBudgetStore } from '../../application/stores/budgetStore'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import BudgetCard from '@/shared/components/molecules/BudgetCard.vue'

const store = useBudgetStore()
const transactionStore = useTransactionStore()
const showAddBudgetModal = ref(false)

const filteredBudgets = computed(() => {
  if (!store.searchQuery) return store.budgets
  const query = store.searchQuery.toLowerCase()
  return store.budgets.filter((b) => b.name.toLowerCase().includes(query))
})

const searchEmptySubtitle = computed(() => {
  return `Não encontramos orçamentos para "${store.searchQuery}"`
})

onMounted(async () => {
  if (transactionStore.transactions.length === 0) {
    const now = new Date()
    await transactionStore.fetchTransactionsByMonth(now.getFullYear(), now.getMonth() + 1)
  }
  await store.fetchBudgets()
})
</script>
