<template>
  <div class="goals-view">
    <header class="view-header">
      <div class="title-section">
        <h1>Metas Financeiras</h1>
        <p class="subtitle">Planeje seu futuro e acompanhe seu progresso</p>
      </div>
      <BaseButton @click="showAddGoalModal = true">+ Nova Meta</BaseButton>
    </header>

    <div class="goals-grid">
      <div v-if="goals.length === 0" class="empty-state">
        <BaseCard>
          <div class="empty-content">
            <span class="icon">🎯</span>
            <h3>Defina sua primeira meta</h3>
            <p>Seja para uma viagem, reserva de emergência ou quitar uma dívida.</p>
            <BaseButton variant="secondary" @click="showAddGoalModal = true">Criar Agora</BaseButton>
          </div>
        </BaseCard>
      </div>
      
      <div v-else class="goals-list">
        <GoalCard 
          v-for="goal in goals" 
          :key="goal.id" 
          :goal="goal"
        />
      </div>

      <aside class="info-sidebar">
        <BaseCard class="goal-tips">
          <template #header>Dicas para Metas</template>
          <ul class="tips-list">
            <li><strong>Seja Específico:</strong> Defina exatamente quanto e para quando.</li>
            <li><strong>Seja Realista:</strong> Comece com valores que cabem no seu orçamento.</li>
            <li><strong>Comemore:</strong> Cada progresso é um passo rumo à sua liberdade.</li>
          </ul>
        </BaseCard>
        
        <BaseCard class="total-summary">
          <template #header>Patrimônio Alocado</template>
          <div class="summary-item">
            <span>Total Acumulado:</span>
            <strong>{{ formatCurrency(totalSaved) }}</strong>
          </div>
          <div class="summary-item">
            <span>Objetivo Total:</span>
            <strong>{{ formatCurrency(totalTarget) }}</strong>
          </div>
          <div class="summary-item total-progress">
            <span>Progresso Geral:</span>
            <strong>{{ ((totalSaved / totalTarget) * 100).toFixed(1) }}%</strong>
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>

<style scoped>
.goals-view {
  max-width: 1200px;
  margin: 0 auto;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.title-section h1 {
  margin: 0;
  font-size: 1.875rem;
  color: #111827;
}
.subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
}
.goals-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}
.empty-state {
  text-align: center;
  padding: 3rem 0;
}
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.empty-content .icon {
  font-size: 3rem;
}
.empty-content h3 {
  margin: 0;
  color: #374151;
}
.empty-content p {
  color: #6b7280;
  max-width: 300px;
}
.info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.tips-list {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4b5563;
}
.tips-list li {
  margin-bottom: 0.75rem;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
}
.total-progress {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
  font-size: 1rem;
  color: #111827;
}

@media (max-width: 1024px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }
}
</style>
