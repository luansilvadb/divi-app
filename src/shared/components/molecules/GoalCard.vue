<template>
  <BaseCard class="goal-card" clickable>
    <template #header>
      <div class="header-content flex justify-between items-center w-full">
        <div class="goal-title-area flex items-center gap-4">
          <BaseIconBox :color="goal.color || 'var(--color-primary-main)'">
            <span class="emoji-icon text-xl leading-none" v-if="goal.icon">{{ goal.icon }}</span>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </BaseIconBox>
          <span class="goal-name text-lg font-bold text-text-primary tracking-tight">{{
            goal.name
          }}</span>
        </div>

        <BaseBadge :color="goal.color || 'var(--color-primary-main)'" variant="subtle">
          {{ goal.type === 'saving' ? 'Acumular' : 'Quitação' }}
        </BaseBadge>
      </div>
    </template>

    <div class="goal-info flex flex-col gap-5 pt-2">
      <div class="values-row flex justify-between items-end">
        <div class="values-main flex items-baseline gap-2">
          <span class="consumed text-2xl font-black text-text-primary tracking-tighter">{{
            formatCurrency(goal.current_value)
          }}</span>
          <span class="limit text-sm font-semibold text-text-secondary opacity-70"
            >/ {{ formatCurrency(goal.target_value) }}</span
          >
        </div>
        <div
          class="percentage-pill text-xs font-black bg-bg-main dark:bg-white/5 px-3 py-1.5 rounded-lg shadow-xs border border-white/10"
          :style="{ color: goal.color || 'var(--color-primary-main)' }"
        >
          {{ Math.round(percentage) }}%
        </div>
      </div>

      <BaseProgressBar :percentage="percentage" :color="goal.color" />

      <div
        class="goal-footer-details flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5"
      >
        <div class="insight-group flex flex-col gap-0.5">
          <span
            class="insight-label text-[0.7rem] font-bold text-text-secondary uppercase tracking-widest"
          >
            {{ percentage < 100 ? 'Faltam' : 'Objetivo' }}
          </span>
          <span
            class="insight-value text-base font-black text-text-primary tracking-tight"
            :class="{ 'text-success-main': percentage >= 100 }"
          >
            {{
              percentage < 100
                ? formatCurrency(goal.target_value - goal.current_value)
                : 'Conquistado!'
            }}
          </span>
        </div>

        <div
          class="date-badge flex items-center gap-2 text-[0.75rem] font-bold text-text-secondary bg-black/3 dark:bg-white/5 px-3 py-2 rounded-xl border border-black/2 dark:border-white/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ formatDate(goal.created_at) }}
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseBadge from '@/shared/components/atoms/BaseBadge.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import type { Goal } from '../../domain/entities/Goal'

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
    currency: 'BRL',
  }).format(value)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Data não disponível'
  return new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}
</script>
