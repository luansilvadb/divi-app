<template>
  <BaseCard class="goal-card-fidelidade glass-card hover-glow">
    <template #header>
      <div class="header-content">
        <div class="goal-title-area">
          <div 
            class="icon-container" 
            :style="{ backgroundColor: (goal.color || '#3b82f6') + '20', color: goal.color || '#3b82f6' }"
          >
            <span class="emoji-icon" v-if="goal.icon">{{ goal.icon }}</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span class="goal-name">{{ goal.name }}</span>
        </div>
        <div 
          class="goal-badge" 
          :style="{ 
            backgroundColor: (goal.color || '#3b82f6') + '15', 
            color: goal.color || '#3b82f6',
            borderColor: (goal.color || '#3b82f6') + '30'
          }"
        >
          {{ goal.type === 'saving' ? 'Acumular' : 'Quitação' }}
        </div>
      </div>
    </template>
    
    <div class="goal-info">
      <div class="values-row">
        <div class="values-main">
          <div class="label-group">
            <span class="consumed">{{ formatCurrency(goal.current_value) }}</span>
            <span class="limit">/ {{ formatCurrency(goal.target_value) }}</span>
          </div>
          <div class="percentage-pill" :style="{ color: goal.color || 'var(--color-primary-main)' }">
            {{ Math.round(percentage) }}%
          </div>
        </div>
      </div>
      
      <div class="progress-track-container">
        <div class="progress-track">
          <div 
            class="progress-fill" 
            :style="{ 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: goal.color || 'var(--color-primary-main)',
              boxShadow: `0 0 12px ${goal.color || 'var(--color-primary-main)'}40`
            }"
          >
            <div class="shimmer-fast"></div>
          </div>
        </div>
      </div>
      
      <div class="goal-footer-details">
        <div class="insight-group">
          <div class="insight-item">
            <span class="insight-label">{{ percentage < 100 ? 'Faltam' : 'Objetivo' }}</span>
            <span class="insight-value" :style="{ color: percentage >= 100 ? 'var(--color-success-main)' : 'inherit' }">
              {{ percentage < 100 ? formatCurrency(goal.target_value - goal.current_value) : 'Conquistado!' }}
            </span>
          </div>
        </div>
        
        <div class="date-badge" v-if="goal.created_at">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          {{ formatDate(goal.created_at) }}
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import type { Goal } from '@/modules/finance/domain/entities'

const props = defineProps<{
  goal: Goal
}>()

const percentage = computed(() => {
  if (props.goal.target_value <= 0) return 0
  return (props.goal.current_value / props.goal.target_value) * 100
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.goal-card-fidelidade {
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 1.25rem;
}

:is(.dark) .goal-card-fidelidade {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}

.hover-glow:hover {
  border-color: rgba(var(--color-primary-main-rgb), 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-title-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-container {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.goal-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.goal-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid transparent;
}

.goal-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.values-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.values-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.label-group {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.consumed {
  font-size: 1.85rem;
  font-weight: 900;
  color: var(--color-text-primary);
  line-height: 1;
  letter-spacing: -0.04em;
}

.limit {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  opacity: 0.8;
}

.percentage-pill {
  font-size: 0.85rem;
  font-weight: 850;
  background: rgba(var(--color-bg-main-rgb), 0.05);
  padding: 0.35rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

:is(.dark) .percentage-pill {
  background: rgba(255, 255, 255, 0.03);
}

.progress-track-container {
  padding: 0.25rem 0;
}

.progress-track {
  height: 12px;
  background: rgba(var(--color-text-primary-rgb), 0.04);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

:is(.dark) .progress-track {
  background: rgba(255, 255, 255, 0.05);
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.shimmer-fast {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: shimmer-animation 2s infinite linear;
}

@keyframes shimmer-animation {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.goal-footer-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(var(--color-text-primary-rgb), 0.05);
  padding-top: 1.25rem;
  margin-top: 0.25rem;
}

.insight-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.insight-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.insight-value {
  font-size: 1rem;
  font-weight: 850;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  background: rgba(var(--color-text-primary-rgb), 0.03);
  padding: 0.5rem 0.85rem;
  border-radius: 12px;
  border: 1px solid rgba(var(--color-text-primary-rgb), 0.02);
}

:is(.dark) .date-info {
  background: rgba(255,255,255,0.05);
}
</style>




