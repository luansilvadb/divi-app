<template>
  <StandardPageLayout
    title="Minhas Metas"
    highlight="Metas"
    subtitle="Transforme seus sonhos em planos concretos. Pequenos passos, grandes conquistas."
    :loading="store.isLoading"
  >
    <!-- Header Actions -->
    <template #action>
      <div class="flex items-center justify-end gap-3 w-full lg:min-w-[420px]">
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          class="!rounded-xl px-6 h-10"
          @click="showAddGoalModal = true"
        >
          Nova Meta
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 space-y-8">
        <!-- Search Bar -->
        <BaseSearchInput
          v-model="store.searchQuery"
          placeholder="Buscar por nome da meta..."
        />

        <!-- Empty State (Matches TransactionsView Style) -->
        <div
          v-if="store.goals.length === 0 && !store.isLoading && !store.searchQuery"
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 class="text-xl font-black uppercase tracking-[0.2em] mb-4 text-surface-800 dark:text-surface-50">
            Sem metas ativas
          </h3>
          <p class="text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
            Você ainda não definiu nenhum objetivo financeiro. Que tal começar a poupar hoje?
          </p>
        </div>

        <!-- Search Empty State -->
        <div
          v-else-if="filteredGoals.length === 0 && !store.isLoading && store.searchQuery"
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
          <div class="flex justify-center py-20">
            <div
              class="w-8 h-8 border-4 border-primary/20 border-t-primary-main rounded-full animate-spin"
            ></div>
          </div>
        </div>

        <!-- Goals Grid -->
        <div v-else-if="filteredGoals.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <GoalCard v-for="goal in filteredGoals" :key="goal.id" :goal="goal" />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column space-y-8">
        <!-- Performance Overview -->
        <BaseCard>
          <template #header>Desempenho Geral</template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Total Acumulado"
              :value="formatCurrency(store.totalSaved)"
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
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </template>
            </BaseSummaryItem>

            <div class="h-px bg-surface-50 dark:bg-surface-800/10"></div>

            <BaseSummaryItem
              label="Objetivo Total"
              :value="formatCurrency(store.totalTarget)"
              color="var(--color-primary-main)"
              status="info"
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </template>
            </BaseSummaryItem>

            <div class="h-px bg-surface-50 dark:bg-surface-800/10"></div>

            <!-- Global Progress Highlight -->
            <div
              class="w-full p-6 rounded-3xl bg-surface-100 dark:bg-surface-950 flex flex-col items-center text-center shadow-inner border border-surface-200 dark:border-surface-200/10"
            >
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 dark:text-surface-400 mb-3"
                >Progresso Consolidado</span
              >
              <div class="text-3xl font-black tracking-tighter text-primary mb-4">
                {{ globalProgress }}%
              </div>
              <BaseProgressBar :percentage="globalProgress" color="var(--color-primary-main)" />
            </div>
          </div>
        </BaseCard>

        <!-- Insights -->
        <BaseCard>
          <template #header>Insights de IA</template>
          <div class="p-2 space-y-4">
            <div class="flex gap-4 p-4 rounded-2xl bg-info-main/5 border border-info-main/10">
              <div
                class="w-10 h-10 rounded-xl bg-info-main/10 text-info-main flex-shrink-0 flex items-center justify-center shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path d="M12 6a1 1 0 0 0-1 1v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V7a1 1 0 0 0-1-1z" />
                </svg>
              </div>
              <p class="text-xs font-bold text-surface-600 dark:text-surface-200 leading-relaxed pt-1">
                Mantendo o ritmo atual, você alcançará a meta
                <span class="text-info-main font-black">"Viagem Japão"</span> em
                <span class="text-success-main font-black">4 meses</span>.
              </p>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Future: GoalForm Component -->
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGoalStore } from '../../application/stores/goalStore'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import GoalCard from '@/shared/components/molecules/GoalCard.vue'

const store = useGoalStore()
const isMobile = useIsMobile()
const showAddGoalModal = ref(false)

const filteredGoals = computed(() => {
  if (!store.searchQuery) return store.goals
  const query = store.searchQuery.toLowerCase()
  return store.goals.filter((g) => g.name.toLowerCase().includes(query))
})

const searchEmptySubtitle = computed(() => {
  return `Não encontramos metas para "${store.searchQuery}"`
})

const globalProgress = computed(() => {
  if (store.totalTarget <= 0) return 0
  return Math.round((store.totalSaved / store.totalTarget) * 100)
})

onMounted(async () => {
  await store.fetchGoals()
})
</script>


