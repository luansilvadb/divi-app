<template>
  <div class="view-wrapper animate-fade-in relative min-h-screen">
    <!-- Visual background shell -->
    <BaseBackgroundOrbs />
    
    <!-- Feature header -->
    <BaseViewHeader 
      title="Suas Conquistas" 
      highlight="Conquistas" 
      subtitle="Transforme seus planos financeiros em realidade tangível."
    >
      <template #action>
        <BaseButton variant="primary" @click="showAddGoalModal = true">
          Nova Meta
        </BaseButton>
      </template>
    </BaseViewHeader>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN: Actions + List -->
      <main class="main-column">
        <BaseCard
          v-if="goals.length === 0"
          is-empty
          empty-title="Comece sua Jornada"
          empty-subtitle="Defina objetivos claros para ver seu patrimônio crescer com propósito."
          empty-color="var(--color-accent-main)"
        >
          <template #empty-icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </template>
          <template #empty-action>
            <BaseButton variant="primary" class="px-8" @click="showAddGoalModal = true">
              Definir Minha Primeira Meta
            </BaseButton>
          </template>
        </BaseCard>

        <div v-else class="flex flex-col gap-6">
          <GoalCard 
            v-for="goal in goals" 
            :key="goal.id" 
            :goal="goal"
          />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <!-- Monthly Metrics -->
        <BaseCard>
          <template #header>Visão Geral das Metas</template>
          
          <div class="flex flex-col gap-8 pt-2">
            <BaseSummaryItem 
              label="VALOR ACUMULADO" 
              :value="formatCurrency(totalSaved)" 
              color="var(--color-success-main)" 
              status="success"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </template>
            </BaseSummaryItem>

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <BaseSummaryItem 
              label="OBJETIVO TOTAL" 
              :value="formatCurrency(totalTarget)" 
              color="var(--color-accent-main)"
              status="info"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </template>
            </BaseSummaryItem>

            <!-- Global Progress Highlight -->
            <div class="mt-4 pt-6 border-t border-black/5 dark:border-white/5">
              <div class="flex justify-between items-end mb-4">
                <span class="text-[0.7rem] font-black uppercase tracking-widest text-text-disabled">Conclusão Geral</span>
                <span class="text-3xl font-black text-primary-main tracking-tighter leading-none">{{ totalProgressFormatted }}%</span>
              </div>
              <BaseProgressBar 
                :percentage="Number(totalProgressFormatted)" 
                color="var(--color-primary-main)" 
              />
              <p class="text-xs font-medium text-text-disabled mt-5 leading-relaxed" v-if="Number(totalProgressFormatted) < 100">
                 Faltam <span class="font-black text-text-secondary">{{ formatCurrency(totalTarget - totalSaved) }}</span> para a conquista plena.
              </p>
            </div>
          </div>
        </BaseCard>

        <!-- Method Strategy Panel -->
        <BaseCard>
          <template #header>Estratégias de Sucesso</template>
          
          <div class="flex flex-col gap-6 pt-2">
            <p class="text-sm text-text-secondary font-medium leading-relaxed">Pequenas ações diárias que aceleram seus objetivos de longo prazo.</p>
            
            <ul class="rule-timeline relative flex flex-col gap-8 pl-8 list-none p-0 m-0">
              <!-- Vertical Line -->
              <div class="absolute top-2 bottom-2 left-2 w-0.5 bg-black/5 dark:bg-white/5 rounded-full"></div>

              <li class="timeline-item flex gap-4 relative">
                <div class="timeline-marker w-4 h-4 rounded-full bg-white border-2 border-primary-main/40 flex items-center justify-center shadow-sm z-10 mt-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-primary-main"></div>
                </div>
                <div class="timeline-content">
                  <h4 class="text-[10px] font-black text-primary-main uppercase tracking-widest mb-1.5">Constância é Chave</h4>
                  <p class="text-xs text-text-disabled font-medium leading-relaxed">Aportes pequenos e regulares vencem grandes aportes esporádicos.</p>
                </div>
              </li>
              
              <li class="timeline-item flex gap-4 relative">
                <div class="timeline-marker w-4 h-4 rounded-full bg-white border-2 border-accent-main/40 flex items-center justify-center shadow-sm z-10 mt-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-accent-main"></div>
                </div>
                <div class="timeline-content">
                  <h4 class="text-[10px] font-black text-accent-main uppercase tracking-widest mb-1.5">Proteja seus Sonhos</h4>
                  <p class="text-xs text-text-disabled font-medium leading-relaxed">Priorize sua reserva de emergência antes de iniciar metas de prazer.</p>
                </div>
              </li>
              
              <li class="timeline-item flex gap-4 relative">
                <div class="timeline-marker w-4 h-4 rounded-full bg-white border-2 border-secondary-main/40 flex items-center justify-center shadow-sm z-10 mt-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-secondary-main"></div>
                </div>
                <div class="timeline-content">
                  <h4 class="text-[10px] font-black text-secondary-main uppercase tracking-widest mb-1.5">Visualize a Vitória</h4>
                  <p class="text-xs text-text-disabled font-medium leading-relaxed">Revise suas metas semanalmente para manter o foco inabalável.</p>
                </div>
              </li>
            </ul>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Modals -->
    <!-- Future: GoalForm Component -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import BaseViewHeader from '@/shared/components/organisms/BaseViewHeader.vue'
import BaseBackgroundOrbs from '@/shared/components/atoms/BaseBackgroundOrbs.vue'
import GoalCard from '../components/GoalCard.vue'
import type { Goal } from '@/modules/finance/domain/entities'

const showAddGoalModal = ref(false)

// Mocks - Will be integrated with GoalService and financeStore
const goals = ref<Goal[]>([
  {
    id: '1',
    user_id: 'user1',
    name: 'Viagem Japão 2027',
    target_value: 20000.00,
    current_value: 5400.00,
    type: 'saving',
    color: '#3b82f6',
    icon: '✈️',
    created_at: '2026-01-15'
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'Reserva de Emergência',
    target_value: 15000.00,
    current_value: 12000.00,
    type: 'saving',
    color: '#10b981',
    icon: '🛡️',
    created_at: '2025-10-01'
  },
  {
    id: '3',
    user_id: 'user1',
    name: 'Quitar Empréstimo',
    target_value: 5000.00,
    current_value: 4500.00,
    type: 'debt',
    color: '#ef4444',
    icon: '💸',
    created_at: '2025-12-01'
  }
])

const totalSaved = computed(() => goals.value.reduce((sum, g) => sum + g.current_value, 0))
const totalTarget = computed(() => goals.value.reduce((sum, g) => sum + g.target_value, 0))

const totalProgressFormatted = computed(() => {
  if (totalTarget.value === 0) return '0.0'
  return ((totalSaved.value / totalTarget.value) * 100).toFixed(1)
})
</script>

<style scoped>
/* Scoped styles removed */
</style>
