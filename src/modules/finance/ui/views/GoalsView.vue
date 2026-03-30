<template>
  <div class="goals-view view-wrapper animate-fade-in">
    <!-- Background Enhancement -->
    <BaseBackgroundOrbs />
    
    <header class="view-header-premium">
      <div class="header-left">
        <div class="breadcrumb">Finanças • Metas</div>
        <h1 class="page-title">Suas <span class="text-accent-main">Conquistas</span></h1>
        <p class="page-subtitle">Transforme seus planos financeiros em realidade tangível.</p>
      </div>
      
      <BaseButton 
        variant="primary" 
        class="add-goal-btn shadow-premium"
        @click="showAddGoalModal = true"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </template>
        Criar Meta
      </BaseButton>
    </header>

    <div class="view-layout-container">
      <!-- Main Content Area -->
      <div class="content-primary">

        <div v-if="goals.length === 0" class="empty-state-premium glass-card">
          <div class="empty-visual">
            <div class="empty-icon-ring">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div class="empty-text">
            <h3>Comece sua Jornada</h3>
            <p>Defina objetivos claros para ver seu patrimônio crescer com propósito.</p>
            <BaseButton variant="primary" class="mt-4 px-8" @click="showAddGoalModal = true">
              Definir Minha Primeira Meta
            </BaseButton>
          </div>
        </div>

        <transition-group name="list-stagger" tag="div" v-else class="goals-grid-premium">
          <GoalCard 
            v-for="(goal, index) in goals" 
            :key="goal.id" 
            :goal="goal"
            :style="{ '--index': index }"
          />
        </transition-group>
      </div>

      <!-- Side Content Area / Sidebar -->
      <aside class="content-secondary">
        <!-- Dashboard Summary Card: High Fidelity -->
        <BaseCard class="wealth-summary-card glass-card hover-glow">
          <template #header>
            <div class="card-header-flex">
              Visão Geral das Metas
            </div>
          </template>
          
          <div class="summary-details">
            <div class="summary-item">
              <div class="summary-icon-box bg-success-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-success-main"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div class="summary-text-stack">
                <span class="summary-label">VALOR ACUMULADO</span>
                <strong class="summary-value text-success-main">{{ formatCurrency(totalSaved) }}</strong>
              </div>
            </div>

            <div class="summary-divider-line"></div>

            <div class="summary-item">
              <div class="summary-icon-box bg-accent-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-accent-main"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div class="summary-text-stack">
                <span class="summary-label">OBJETIVO TOTAL</span>
                <strong class="summary-value">{{ formatCurrency(totalTarget) }}</strong>
              </div>
            </div>
          </div>

          <!-- Overall Progress Viz (Refined) -->
          <div class="overall-progress-viz-box">
            <div class="viz-header">
              <span class="viz-label">Conclusão Geral</span>
              <span class="viz-percentage">{{ totalProgressFormatted }}%</span>
            </div>
            <div class="progress-track-fidelidade">
              <div 
                class="progress-fill-premium" 
                :style="{ 
                  width: `${totalProgressFormatted}%`,
                  background: 'linear-gradient(90deg, var(--color-primary-main), var(--color-secondary-main))'
                }"
              >
                <div class="shimmer-fast"></div>
              </div>
            </div>
            <p class="viz-subtitle" v-if="Number(totalProgressFormatted) < 100">
               Faltam <span class="font-bold text-text-primary">{{ formatCurrency(totalTarget - totalSaved) }}</span> para a conquista plena.
            </p>
          </div>
        </BaseCard>

        <!-- Mastery/Tips Section: High Fidelity -->
        <BaseCard class="mastery-guide-card glass-card">
          <template #header>
            <div class="card-header-flex">
              Estratégias de Sucesso
            </div>
          </template>
          
          <div class="guide-timeline-wrapper">
            <p class="guide-intro-text">Pequenas ações diárias que aceleram seus objetivos de longo prazo.</p>
            
            <ul class="fidelidade-timeline-list">
              <li class="fidelidade-timeline-item">
                <div class="timeline-marker-container">
                  <div class="marker-target-ring primary-ring">
                    <div class="marker-target-dot"></div>
                  </div>
                  <div class="timeline-marker-line"></div>
                </div>
                <div class="fidelidade-timeline-content">
                  <h4 class="text-primary-main">Constância é Chave</h4>
                  <p>Aportes pequenos e regulares vencem grandes aportes esporádicos.</p>
                </div>
              </li>
              
              <li class="fidelidade-timeline-item">
                <div class="timeline-marker-container">
                  <div class="marker-target-ring accent-ring">
                    <div class="marker-target-dot"></div>
                  </div>
                  <div class="timeline-marker-line"></div>
                </div>
                <div class="fidelidade-timeline-content">
                  <h4 class="text-accent-main">Proteja seus Sonhos</h4>
                  <p>Priorize sua reserva de emergência antes de iniciar metas de prazer.</p>
                </div>
              </li>
              
              <li class="fidelidade-timeline-item">
                <div class="timeline-marker-container">
                  <div class="marker-target-ring secondary-ring">
                    <div class="marker-target-dot"></div>
                  </div>
                </div>
                <div class="fidelidade-timeline-content">
                  <h4 class="text-secondary-main">Visualize a Vitória</h4>
                  <p>Revise suas metas semanalmente para manter o foco inabalável.</p>
                </div>
              </li>
            </ul>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import GoalCard from '../components/GoalCard.vue'
import BaseBackgroundOrbs from '@/shared/components/atoms/BaseBackgroundOrbs.vue'
import type { Goal } from '@/modules/finance/domain/entities'

const showAddGoalModal = ref(false)

// Mocks for now - will be replaced by store integration
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>

<style scoped>
.view-wrapper {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.goals-view {
  min-height: 100vh;
}

.view-layout-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2.5rem;
  width: 100%;
}

.content-secondary {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 1200px) {
  .view-layout-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Header Premium */
.view-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  gap: 1.5rem;
}

.breadcrumb {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-accent-main);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin: 0 0 0.5rem 0;
  line-height: 1;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0;
}

.add-goal-btn {
  padding: 1rem 2rem;
  border-radius: 1.25rem;
  font-weight: 700;
  font-size: 1.1rem;
}

/* Grid & Empty State */
.goals-grid-premium {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-state-premium {
  padding: 5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.empty-icon-ring {
  width: 96px; height: 96px;
  border-radius: 50%;
  border: 2px dashed rgba(var(--color-accent-main-rgb), 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-main);
  background: rgba(var(--color-accent-main-rgb), 0.05);
}

.empty-text h3 {
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

/* Sidebar Cards Base Styles */
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 1.5rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

:is(.dark) .glass-card {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(255, 255, 255, 0.08);
}

.hover-glow:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--color-primary-main-rgb), 0.3);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
}

:is(.dark) .hover-glow:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.card-header-flex {
  font-size: 1.25rem;
  font-weight: 850;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

/* Wealth Summary Fidelity */
.wealth-summary-card {
  padding: 1.5rem;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.75rem 0;
}

.summary-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.bg-success-light { background: rgba(var(--color-success-main-rgb), 0.1); }
.bg-accent-light { background: rgba(var(--color-accent-main-rgb), 0.1); }

.summary-text-stack {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  line-height: 1;
}

.summary-divider-line {
  height: 1px;
  background: linear-gradient(90deg, rgba(var(--color-text-primary-rgb, 255,255,255), 0.08) 0%, transparent 100%);
  width: 100%;
}

.overall-progress-viz-box {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.viz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.viz-label {
  font-size: 0.9rem;
  font-weight: 700;
}

.viz-percentage {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--color-primary-main);
  line-height: 1;
}

.progress-track-fidelidade {
  height: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 999px;
  overflow: hidden;
  margin: 1.25rem 0;
  position: relative;
}

:is(.dark) .progress-track-fidelidade {
  background: rgba(255, 255, 255, 0.06);
}

.progress-fill-premium {
  height: 100%;
  border-radius: inherit;
  position: relative;
  overflow: hidden;
  transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.shimmer-fast {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer-animation 2s infinite linear;
}

@keyframes shimmer-animation {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.viz-subtitle {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* Mastery Timeline Fidelity */
.mastery-guide-card {
  padding: 1.5rem;
}

.guide-timeline-wrapper {
  margin-top: 0.5rem;
}

.guide-intro-text {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.fidelidade-timeline-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.fidelidade-timeline-item {
  display: flex;
  gap: 1.5rem;
  min-height: 100px;
}

.fidelidade-timeline-item:last-child {
  min-height: auto;
}

.timeline-marker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 24px;
  flex-shrink: 0;
}

.timeline-marker-line {
  flex-grow: 1;
  width: 2px;
  background: rgba(var(--color-text-primary-rgb, 255,255,255), 0.08);
  margin: 0.5rem 0;
}

.marker-target-ring {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 4px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: var(--color-bg-main, #0f172a);
}

.marker-target-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.primary-ring { border-color: rgba(var(--color-primary-main-rgb), 0.2); color: var(--color-primary-main); }
.accent-ring { border-color: rgba(var(--color-accent-main-rgb), 0.2); color: var(--color-accent-main); }
.secondary-ring { border-color: rgba(var(--color-secondary-main-rgb), 0.2); color: var(--color-secondary-main); }

.fidelidade-timeline-content {
  padding-bottom: 1.5rem;
}

.fidelidade-timeline-content h4 {
  font-size: 1.125rem;
  font-weight: 850;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.fidelidade-timeline-content p {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Animations Core */
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.list-stagger-enter-active, .list-stagger-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.list-stagger-enter-from, .list-stagger-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
