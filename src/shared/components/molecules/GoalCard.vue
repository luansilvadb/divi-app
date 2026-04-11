<template>
  <BaseCard class="goal-card hover-glow" clickable>
    <template #header>
      <div class="header-content flex justify-between items-center w-full">
        <div class="goal-title-area flex items-center gap-4">
          <BaseIconBox :color="goal.color || '#8b5cf6'">
            <span class="emoji-icon text-xl leading-none" v-if="goal.icon">{{ goal.icon }}</span>
            <i v-else class="i-lucide-target text-xl"></i>
          </BaseIconBox>
          <span
            class="goal-name text-lg font-bold text-zinc-800 dark:text-zinc-50 tracking-tight"
            >{{ goal.name }}</span
          >
          <ItemSyncIndicator :status="goal.sync_status" />
        </div>

        <BaseBadge :color="goal.color || '#8b5cf6'" variant="subtle">
          {{ goal.type === 'saving' ? 'Acumular' : 'Quitação' }}
        </BaseBadge>
      </div>
    </template>

    <div class="goal-info flex flex-col gap-5 pt-2">
      <div class="values-row flex justify-between items-end">
        <div class="values-main flex items-baseline gap-2">
          <span
            class="consumed text-2xl font-black text-zinc-800 dark:text-zinc-50 tracking-tighter"
            >{{ formatCurrency(goal.current_value) }}</span
          >
          <span
            class="limit text-sm font-semibold text-zinc-400 opacity-70"
            >/ {{ formatCurrency(goal.target_value) }}</span
          >
        </div>
        <div
          class="percentage-pill text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800"
          :style="{ color: goal.color || '#8b5cf6' }"
        >
          {{ Math.round(percentage) }}%
        </div>
      </div>

      <BaseProgressBar :percentage="percentage" :color="goal.color" />

      <div
        class="goal-footer-details flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800"
      >
        <div class="insight-group flex flex-col gap-0.5">
          <span
            class="insight-label text-[9px] font-bold text-zinc-400 uppercase tracking-widest"
          >
            {{ percentage < 100 ? 'Faltam' : 'Objetivo' }}
          </span>
          <span
            class="insight-value text-base font-black text-zinc-800 dark:text-zinc-50 tracking-tight"
            :class="{ '!text-emerald-500': percentage >= 100 }"
          >
            {{
              percentage < 100
                ? formatCurrency(goal.target_value - goal.current_value)
                : 'Conquistado!'
            }}
          </span>
        </div>

        <div
          class="date-badge flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl"
        >
          <i class="i-lucide-calendar-days text-sm"></i>
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
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'

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
  if (!dateString) return '---'
  return new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase()
}
</script>
