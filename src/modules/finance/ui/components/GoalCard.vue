<template>
  <BaseCard class="goal-card">
    <div class="goal-header">
      <div class="icon-title">
        <span class="goal-icon" v-if="goal.icon">{{ goal.icon }}</span>
        <span class="goal-name">{{ goal.name }}</span>
      </div>
      <BaseBadge :color="goal.color || '#10b981'">
        {{ goal.type === 'saving' ? 'Economia' : 'Dívida' }}
      </BaseBadge>
    </div>

    <div class="goal-body">
      <div class="progress-info">
        <span class="percentage">{{ progress.toFixed(0) }}%</span>
        <span class="values">
          {{ formatCurrency(goal.current_value) }} de {{ formatCurrency(goal.target_value) }}
        </span>
      </div>
      
      <div class="progress-bar-container">
        <div 
          class="progress-bar" 
          :style="{ 
            width: `${progress}%`,
            backgroundColor: goal.color || '#10b981'
          }"
        ></div>
      </div>

      <div class="remaining" v-if="progress < 100">
        Faltam {{ formatCurrency(goal.target_value - goal.current_value) }}
      </div>
      <div class="completed" v-else>
        🎉 Meta alcançada!
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseBadge from '@/shared/components/atoms/BaseBadge.vue'
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
</script>

<style scoped>
.goal-card {
  margin-bottom: 1rem;
}
.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.icon-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.goal-icon {
  font-size: 1.25rem;
}
.goal-name {
  font-weight: 600;
  color: #1f2937;
}
.goal-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}
.values {
  font-size: 0.875rem;
  color: #6b7280;
}
.progress-bar-container {
  height: 0.75rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  transition: width 0.5s ease-out;
}
.remaining {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: right;
}
.completed {
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
  text-align: center;
}
</style>
