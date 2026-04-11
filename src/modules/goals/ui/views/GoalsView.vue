<template>
  <StandardPageLayout
    title="Minhas Metas"
    highlight="Metas"
    subtitle="Transforme seus sonhos em planos concretos. Pequenos passos, grandes conquistas."
    :loading="store.isLoading"
  >
    <template #action>
      <div class="flex items-center justify-end gap-3 w-full lg:min-w-[420px]">
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          class="!rounded-xl px-6 h-10 shadow-lg shadow-violet-500/20"
          @click="showAddGoalModal = true"
        >
          <template #icon><i class="i-lucide-plus text-lg"></i></template>
          Nova Meta
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 space-y-8">
        <BaseSearchInput v-model="store.searchQuery" placeholder="Buscar por nome da meta..." />

        <!-- Empty State -->
        <div
          v-if="store.goals.length === 0 && !store.isLoading && !store.searchQuery"
          class="flex flex-col items-center justify-center py-24 text-center opacity-40 animate-fade-in"
        >
          <div class="w-24 h-24 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-8 text-violet-500">
            <i class="i-lucide-target text-5xl"></i>
          </div>
          <h3 class="text-xl font-black uppercase tracking-widest mb-4 text-zinc-800 dark:text-zinc-50">
            Sem metas ativas
          </h3>
          <p class="text-xs font-bold uppercase tracking-widest text-zinc-400 leading-relaxed max-w-xs">
            Você ainda não definiu nenhum objetivo financeiro. Que tal começar a poupar hoje?
          </p>
        </div>

        <!-- Search Empty State -->
        <div
          v-else-if="filteredGoals.length === 0 && !store.isLoading && store.searchQuery"
          class="flex flex-col items-center justify-center py-20 text-center opacity-40 animate-fade-in"
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

        <!-- Goals Grid -->
        <div v-else-if="filteredGoals.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <GoalCard v-for="goal in filteredGoals" :key="goal.id" :goal="goal" />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column space-y-8">
        <BaseCard class="hover-glow">
          <template #header>Desempenho Geral</template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Total Acumulado"
              :value="formatCurrency(store.totalSaved)"
              color="#10b981"
              status="success"
            >
              <template #icon><i class="i-lucide-piggy-bank"></i></template>
            </BaseSummaryItem>

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <BaseSummaryItem
              label="Objetivo Total"
              :value="formatCurrency(store.totalTarget)"
              color="#8b5cf6"
              status="info"
            >
              <template #icon><i class="i-lucide-target"></i></template>
            </BaseSummaryItem>

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <div class="w-full p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center text-center shadow-inner border border-zinc-200 dark:border-zinc-800">
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Progresso Consolidado</span>
              <div class="text-3xl font-black tracking-tighter text-violet-500 mb-4">
                {{ globalProgress }}%
              </div>
              <BaseProgressBar :percentage="globalProgress" color="#8b5cf6" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="hover-glow">
          <template #header>Insights de IA</template>
          <div class="p-2 space-y-4">
            <div class="flex gap-4 p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10 relative overflow-hidden group">
              <div class="absolute -right-4 -top-4 w-12 h-12 bg-violet-500/10 blur-2xl rounded-full transition-all group-hover:scale-150"></div>
              <div class="flex flex-col gap-1 relative z-10">
                <p class="text-sm font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Mantendo o ritmo atual, você alcançará a meta
                  <span class="text-violet-500 font-black">"Viagem Japão"</span> em
                  <span class="text-emerald-500 font-black">4 meses</span>.
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NButton } from 'naive-ui'
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
