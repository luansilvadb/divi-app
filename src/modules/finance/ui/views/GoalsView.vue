<template>
  <div class="goals-view animate-fade-in">
    <!-- Background Decor -->
    <div class="goals-bg-decor" aria-hidden="true">
      <div class="glass-orb orb-1"></div>
      <div class="glass-orb orb-2"></div>
    </div>

    <!-- Header Section -->
    <header class="goals-header">
      <div class="header-content">
        <h1 class="page-title">
          Metas <span class="text-accent-main">Financeiras</span>
        </h1>
        <p class="page-subtitle">Planeje seu futuro, acompanhe seu progresso e realize seus sonhos.</p>
      </div>
      <div class="header-actions">
        <BaseButton 
          variant="primary" 
          class="new-goal-btn"
          @click="showAddGoalModal = true"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </template>
          Nova Meta
        </BaseButton>
      </div>
    </header>

    <div class="goals-content-grid">
      <!-- Main Column: Goals List -->
      <div class="main-column">
        <div v-if="goals.length === 0" class="empty-state">
          <BaseCard class="glass-card empty-state-card">
            <div class="empty-content">
              <div class="empty-icon-wrapper">
                <span class="icon">🎯</span>
              </div>
              <h3 class="empty-title">Defina sua primeira meta</h3>
              <p class="empty-text">Seja para uma viagem inesquecível, uma reserva de emergência ou para quitar uma dívida. Dê o primeiro passo!</p>
              <BaseButton variant="primary" @click="showAddGoalModal = true" class="mt-4">
                Criar Minha Primeira Meta
              </BaseButton>
            </div>
          </BaseCard>
        </div>
        
        <div v-else class="goals-list">
          <GoalCard 
            v-for="(goal, index) in goals" 
            :key="goal.id" 
            :goal="goal"
            :style="{ animationDelay: `${index * 0.1}s` }"
            class="goal-card-animated"
          />
        </div>
      </div>

      <!-- Right Column: Info Sidebar -->
      <aside class="side-column">
        <!-- Dashboard Summary -->
        <BaseCard class="summary-card glass-card hover-glow">
          <template #header>
            <div class="card-header text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>Resumo do Patrimônio</span>
            </div>
          </template>
          
          <div class="summary-body">
            <div class="summary-item">
              <div class="item-label">
                <div class="label-dot bg-success-main"></div>
                <span>Total Acumulado</span>
              </div>
              <strong class="item-value text-success-main">{{ formatCurrency(totalSaved) }}</strong>
            </div>

            <div class="summary-item">
              <div class="item-label">
                <div class="label-dot bg-primary-main"></div>
                <span>Objetivo Total</span>
              </div>
              <strong class="item-value">{{ formatCurrency(totalTarget) }}</strong>
            </div>

            <div class="total-progress-section">
              <div class="progress-header">
                <span class="progress-label">Progresso Geral</span>
                <span class="progress-percent text-primary-main">{{ totalProgressFormatted }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${totalProgressFormatted}%` }"></div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Tooltip/Tips Card -->
        <BaseCard class="tips-card glass-card hover-glow">
          <template #header>
            <div class="card-header text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Dicas para o Sucesso</span>
            </div>
          </template>
          
          <ul class="tips-list">
            <li class="tip-item">
              <div class="tip-icon">✨</div>
              <div class="tip-content">
                <strong>Seja Específico:</strong> Defina exatamente quanto você precisa e um prazo claro.
              </div>
            </li>
            <li class="tip-item">
              <div class="tip-icon">🌱</div>
              <div class="tip-content">
                <strong>Seja Realista:</strong> Comece com valores que cabem confortavelmente no seu orçamento.
              </div>
            </li>
            <li class="tip-item">
              <div class="tip-icon">🎉</div>
              <div class="tip-content">
                <strong>Comemore:</strong> Cada pequeno progresso é um grande passo rumo à sua liberdade.
              </div>
            </li>
          </ul>
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
.goals-view {
  width: 100%;
  padding: 2rem 2.5rem;
  position: relative;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: 100%;
}

/* Background Decorations */
.goals-bg-decor {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--color-primary-main);
  top: -150px;
  right: -100px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--color-accent-main);
  bottom: -100px;
  left: -50px;
  opacity: 0.1;
}

:is(.dark) .glass-orb {
  opacity: 0.2;
}

/* Header Styles */
.goals-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

/* Layout Grid */
.goals-content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  width: 100%;
}

.main-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

/* Glass Cards Generic */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}

:is(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}

.hover-glow:hover {
  border-color: var(--color-primary-main);
  box-shadow: 0 4px 24px rgba(var(--color-primary-main-rgb), 0.1);
  transform: translateY(-2px);
}

/* Empty State Premium */
.empty-state-card {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1.5rem;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(var(--color-primary-main-rgb), 0.1), rgba(var(--color-secondary-main-rgb), 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 0 30px rgba(var(--color-primary-main-rgb), 0.2);
}

.empty-content .icon {
  font-size: 2.5rem;
}

.empty-title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.empty-text {
  color: var(--color-text-secondary);
  max-width: 380px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}

/* Goals List */
.goals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  gap: 1.5rem;
}

.goal-card-animated {
  animation: slideUpFade 0.6s ease-out both;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Sidebar Cards */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
}

.text-primary {
  color: var(--color-primary-main);
}

.text-accent {
  color: var(--color-accent-main);
}

.header-icon {
  opacity: 0.8;
}

/* Summary Card */
.summary-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--color-border-main);
}

.item-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.label-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.item-value {
  font-size: 1.125rem;
  font-weight: 700;
}

.total-progress-section {
  margin-top: 0.5rem;
  background: rgba(var(--color-primary-main-rgb), 0.03);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(var(--color-primary-main-rgb), 0.1);
}

:is(.dark) .total-progress-section {
  background: rgba(255, 255, 255, 0.02);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.progress-percent {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}

.progress-track {
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 99px;
  overflow: hidden;
}

:is(.dark) .progress-track {
  background: rgba(255, 255, 255, 0.05);
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--color-primary-main), var(--color-accent-main));
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Tips Card */
.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tip-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.tip-icon {
  font-size: 1.25rem;
  line-height: 1.2;
  background: rgba(var(--color-accent-main-rgb), 0.1);
  padding: 0.5rem;
  border-radius: 10px;
}

.tip-content {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.tip-content strong {
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 0.125rem;
}

/* Responsive */
@media (max-width: 1100px) {
  .goals-content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .side-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .goals-view {
    padding: 1.5rem 1rem;
  }

  .goals-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .new-goal-btn {
    width: 100%;
  }

  .side-column {
    grid-template-columns: 1fr;
  }
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
