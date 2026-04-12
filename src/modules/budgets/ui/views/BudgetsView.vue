<template>
  <StandardPageLayout
    title="Meus Orçamentos"
    highlight="Orçamentos"
    subtitle="Defina metas e controle seus gastos mensais."
    :loading="store.isLoading"
  >
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-32 md:pb-0">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 order-2 lg:order-1">
        <NSpace vertical :size="24">
          <BaseSearchInput
            v-model="store.searchQuery"
            placeholder="Buscar por nome do orçamento..."
          />

          <!-- Empty State (Cleaned) -->
          <NEmpty
            v-if="store.budgets.length === 0 && !store.isLoading && !store.searchQuery"
            description="Você ainda não criou planejamentos de gastos ou metas de economia."
            class="py-24"
          >
            <template #icon>
              <i class="i-lucide-wallet text-5xl text-violet-500/40"></i>
            </template>
          </NEmpty>

          <!-- Search Empty State -->
          <NEmpty
            v-else-if="filteredBudgets.length === 0 && !store.isLoading && store.searchQuery"
            :description="searchEmptySubtitle"
            class="py-20"
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
          <div v-else-if="store.isLoading" class="flex justify-center py-20">
            <NSpin size="large" />
          </div>

          <!-- Budget List Grid (Max 2 Columns) -->
          <NGrid
            v-else-if="filteredBudgets.length > 0"
            :cols="isMobile ? 1 : 2"
            :x-gap="20"
            :y-gap="20"
          >
            <NGridItem v-for="budget in filteredBudgets" :key="budget.id">
              <BudgetCard
                :budget="budget"
                :consumed="store.getConsumed(budget)"
                @click="handleEditBudget(budget)"
              />
            </NGridItem>
          </NGrid>
        </NSpace>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column order-1 lg:order-2">
        <NSpace vertical :size="16">
          <NCard>
            <template #header><NText strong>Visão Geral</NText></template>
            <NSpace vertical :size="16">
              <NStatistic label="Total Orçado">
                <NText type="primary" strong>{{ formatCurrency(store.totalBudgeted) }}</NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NStatistic label="Total Consumido">
                <NText
                  :type="store.totalConsumed > store.totalBudgeted ? 'error' : 'success'"
                  strong
                >
                  {{ formatCurrency(store.totalConsumed) }}
                </NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NCard embedded size="small" class="text-center">
                <NText depth="3" class="text-xs uppercase tracking-widest block mb-2">Status de Saúde</NText>
                <NTag
                  v-if="store.totalConsumed > store.totalBudgeted"
                  type="error"
                  size="medium"
                  round
                >
                  <template #icon><i class="i-lucide-alert-triangle"></i></template>
                  Limite Excedido
                </NTag>
                <NTag v-else type="success" size="medium" round>
                  <template #icon><i class="i-lucide-check-circle"></i></template>
                  Dentro do Planejado
                </NTag>
              </NCard>
            </NSpace>
          </NCard>

          <!-- Insights -->
          <NCard>
            <template #header><NText strong>Insights de IA</NText></template>
            <NCard embedded size="small" class="!border-violet-500/10 !bg-violet-500/5">
              <NText class="text-sm leading-relaxed">
                Você economizou <NText type="primary" strong>R$ 340,00</NText> em
                <NText strong>Lazer</NText>
                comparado ao mês passado.
              </NText>
            </NCard>
          </NCard>
        </NSpace>
      </aside>
    </div>

    <BudgetDialog :show="showAddBudgetModal" :budget="selectedBudget" @close="handleCloseModal" />
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  NButton,
  NCard,
  NStatistic,
  NSpace,
  NText,
  NTag,
  NEmpty,
  NDivider,
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
