<template>
  <StandardPageLayout
    title="Minhas Metas de Vida"
    highlight="Metas"
    subtitle="Transforme seus sonhos em planos concretos. Pequenos passos, grandes conquistas."
  >
    <template #action>
      <BaseButton variant="primary" @click="showAddGoalModal = true"> Nova Meta </BaseButton>
    </template>

    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <!-- Empty State -->
        <div
          v-if="store.goals.length === 0 && !store.isLoading"
          class="flex flex-col items-center justify-center py-20 opacity-40 text-center glass-card"
        >
          <div
            class="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span class="text-sm font-black uppercase tracking-widest mb-2">Sem metas ativas</span>
          <p class="text-xs font-bold max-w-xs mx-auto mb-6">
            Você ainda não definiu nenhum objetivo financeiro. Que tal começar a poupar hoje?
          </p>
          <BaseButton variant="primary" class="px-8" @click="showAddGoalModal = true">
            Definir Minha Primeira Meta
          </BaseButton>
        </div>

        <!-- Loading State -->
        <div v-else-if="store.isLoading" class="flex justify-center py-20">
          <div
            class="w-8 h-8 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin"
          ></div>
        </div>

        <!-- Goals Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
          <GoalCard v-for="goal in store.goals" :key="goal.id" :goal="goal" />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
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

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

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

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <!-- Global Progress -->
            <div
              class="w-full p-5 rounded-3xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center border border-black/5 dark:border-white/5"
            >
              <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-2"
                >Progresso Consolidado</span
              >
              <div class="text-3xl font-black tracking-tighter text-primary-main mb-1">
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
            <div class="flex gap-4">
              <div
                class="w-8 h-8 rounded-lg bg-info-main/10 text-info-main flex-shrink-0 flex items-center justify-center"
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
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <p class="text-xs font-bold text-text-secondary leading-relaxed">
                Mantendo o ritmo atual de investimentos, você alcançará a meta
                <span class="text-text-primary">"Viagem Japão"</span> em
                <span class="text-success-main">4 meses</span>.
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
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import GoalCard from '@/shared/components/molecules/GoalCard.vue'

const store = useGoalStore()
const showAddGoalModal = ref(false)

const globalProgress = computed(() => {
  if (store.totalTarget <= 0) return 0
  return Math.round((store.totalSaved / store.totalTarget) * 100)
})

onMounted(async () => {
  await store.fetchGoals()
})
</script>
