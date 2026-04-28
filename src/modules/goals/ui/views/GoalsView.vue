<template>
  <StandardPageLayout
    title="Minhas Metas"
    highlight="Metas"
    subtitle="Transforme seus sonhos em planos concretos. Pequenos passos, grandes conquistas."
    :loading="store.isLoading"
  >
    <template #action>
      <div class="flex items-center gap-3">
        <AppleButton
          v-if="!isMobile"
          variant="primary"
          size="medium"
          @click="showAddGoalModal = true"
        >
          Nova Meta
        </AppleButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2">
        <NSpace vertical :size="24">
          <BaseSearchInput v-model="store.searchQuery" placeholder="Buscar por nome da meta..." />

          <NEmpty
            v-if="store.goals.length === 0 && !store.isLoading && !store.searchQuery"
            description="Você ainda não definiu nenhum objetivo financeiro. Que tal começar a poupar hoje?"
            class="py-24"
          >
            <template #icon>
              <i class="i-lucide-target text-5xl text-[rgba(0,122,255,0.3)] dark:text-[rgba(10,132,255,0.3)]"></i>
            </template>
          </NEmpty>

          <NEmpty
            v-else-if="filteredGoals.length === 0 && !store.isLoading && store.searchQuery"
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

          <div v-else-if="store.isLoading" class="flex justify-center py-20">
            <NSpin size="large" />
          </div>

          <NGrid
            v-else-if="filteredGoals.length > 0"
            :cols="'1 1024:2'"
            :x-gap="20"
            :y-gap="20"
            responsive="screen"
            item-responsive
          >
            <NGridItem v-for="goal in filteredGoals" :key="goal.id">
              <GoalCard :goal="goal" />
            </NGridItem>
          </NGrid>
        </NSpace>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <NSpace vertical :size="16">
          <NCard>
            <template #header><NText strong>Desempenho Geral</NText></template>
            <NSpace vertical :size="16">
              <NStatistic label="Total Acumulado">
                <NText type="success" strong>{{ formatCurrency(store.totalSaved) }}</NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NStatistic label="Objetivo Total">
                <NText type="primary" strong>{{ formatCurrency(store.totalTarget) }}</NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NCard embedded size="small" class="text-center">
                <NText depth="3" class="text-xs uppercase tracking-widest block mb-2">Progresso Consolidado</NText>
                <NText type="primary" strong class="text-2xl tabular-nums block mb-3">
                  {{ globalProgress }}%
                </NText>
                <NProgress
                  type="line"
                  :percentage="globalProgress"
                  :show-indicator="false"
                  :height="6"
                />
              </NCard>
            </NSpace>
          </NCard>

          <NCard>
            <template #header><NText strong>Insights de IA</NText></template>
            <NCard embedded size="small" class="!border-[rgba(0,122,255,0.1)] !bg-[rgba(0,122,255,0.05)]">
              <NText class="text-sm leading-relaxed">
                Mantendo o ritmo atual, você alcançará a meta
                <NText type="primary" strong>"Viagem Japão"</NText> em
                <NText type="success" strong>4 meses</NText>.
              </NText>
            </NCard>
          </NCard>
        </NSpace>
      </aside>
    </div>

    <!-- Mobile FAB Button -->
    <div
      v-if="isMobile"
      class="fixed bottom-24 right-6 z-50 md:hidden"
    >
      <AppleButton
        variant="primary"
        size="large"
        @click="showAddGoalModal = true"
        class="!rounded-full !w-14 !h-14 !p-0 !shadow-lg"
      >
        <i class="i-lucide-plus text-xl"></i>
      </AppleButton>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  NCard,
  NStatistic,
  NSpace,
  NText,
  NEmpty,
  NDivider,
  NSpin,
  NProgress,
  NGrid,
  NGridItem,
} from 'naive-ui'
import { useGoalStore } from '../../application/stores/goalStore'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AppleButton from '@/shared/components/apple-ui/AppleButton.vue'
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
