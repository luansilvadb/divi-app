<template>
  <BaseCard class="goal-card glass-card hover-glow" :clickable="true">
    <div class="p-1">
      <div class="goal-header">
        <div class="icon-title">
          <div 
            class="icon-wrapper"
            :style="{ 
              backgroundColor: `${goal.color || '#10b981'}15`,
              color: goal.color || '#10b981',
              boxShadow: `0 0 20px ${goal.color || '#10b981'}20` 
            }"
          >
            <span class="goal-icon" v-if="goal.icon">{{ goal.icon }}</span>
          </div>
          <div class="title-wrapper">
            <h3 class="goal-name">{{ goal.name }}</h3>
            <span class="goal-date" v-if="goal.created_at">Criado em {{ formatDate(goal.created_at) }}</span>
          </div>
        </div>
        <div 
          class="goal-badge"
          :style="{ 
            backgroundColor: `${goal.color || '#10b981'}15`,
            color: goal.color || '#10b981',
            border: `1px solid ${goal.color || '#10b981'}30`
          }"
        >
          {{ goal.type === 'saving' ? 'Economia' : 'Dívida' }}
        </div>
      </div>

      <div class="goal-body">
        <div class="progress-info">
          <div class="progress-text">
            <span class="percentage" :style="{ color: goal.color || '#10b981' }">
              {{ progress.toFixed(0) }}%
            </span>
            <span class="status-label">concluído</span>
          </div>
          <span class="values">
            <strong class="current-val">{{ formatCurrency(goal.current_value) }}</strong>
            <span class="divider-slash">/</span>
            <span class="target-val">{{ formatCurrency(goal.target_value) }}</span>
          </span>
        </div>
        
        <div class="progress-bar-container">
          <div 
            class="progress-bar" 
            :style="{ 
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${goal.color || '#10b981'}dd, ${goal.color || '#10b981'})`,
              boxShadow: `0 0 10px ${goal.color || '#10b981'}60`
            }"
          >
            <div class="progress-glow"></div>
          </div>
        </div>

        <div class="footer-info">
          <div class="remaining" v-if="progress < 100">
            Faltam <span class="font-semibold">{{ formatCurrency(goal.target_value - goal.current_value) }}</span>
          </div>
          <div class="completed" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Meta alcançada!
          </div>
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

const progress = computed(() => {
  if (props.goal.target_value <= 0) return 0
  const p = (props.goal.current_value / props.goal.target_value) * 100
  return Math.min(p, 100)
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
/* Glass Cards & Effects */
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

:is(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.hover-glow:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  border-color: rgba(255, 255, 255, 0.8);
}

:is(.dark) .hover-glow:hover {
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.15);
}

/* Card Content Styles */
.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.icon-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.hover-glow:hover .icon-wrapper {
  transform: scale(1.05) rotate(-2deg);
}

.goal-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.title-wrapper {
  display: flex;
  flex-direction: column;
}

.goal-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.125rem 0;
  letter-spacing: -0.01em;
}

.goal-date {
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  font-weight: 500;
}

.goal-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.goal-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.progress-text {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.percentage {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}

.status-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.values {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.current-val {
  color: var(--color-text-primary);
  font-weight: 700;
}

.divider-slash {
  color: var(--color-text-disabled);
}

.target-val {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.progress-bar-container {
  height: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

:is(.dark) .progress-bar-container {
  background-color: rgba(255, 255, 255, 0.05);
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  position: relative;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.footer-info {
  display: flex;
  justify-content: flex-end;
}

.remaining {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  background: rgba(0, 0, 0, 0.03);
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
}

:is(.dark) .remaining {
  background: rgba(255, 255, 255, 0.03);
}

.completed {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-success-main);
  background: rgba(16, 185, 129, 0.1);
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
}

@media (max-width: 640px) {
  .progress-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

