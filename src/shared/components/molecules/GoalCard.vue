<template>
  <DataCard hoverable clickable v-bind="$attrs">
    <template #header-left>
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          :style="{ backgroundColor: `${goal.color || '#8b5cf6'}1A`, color: goal.color || '#8b5cf6' }"
        >
          <span v-if="goal.icon" class="leading-none">{{ goal.icon }}</span>
          <i v-else class="i-lucide-target"></i>
        </div>
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-2">
            <span class="card-title">{{ goal.name }}</span>
            <ItemSyncIndicator :status="goal.sync_status" />
          </div>
          <NTag
            size="tiny"
            :color="{ textColor: goal.color || '#8b5cf6', borderColor: 'transparent', color: `${goal.color || '#8b5cf6'}1A` }"
            round
            :bordered="false"
          >
            {{ goal.type === 'saving' ? 'Acumular' : 'Quitação' }}
          </NTag>
        </div>
      </div>
    </template>

    <template #values>
      <div class="flex items-end justify-between">
        <div class="flex items-baseline gap-2">
          <span class="value-display">{{ formatCurrency(goal.current_value) }}</span>
          <span class="text-label-secondary text-sm">
            / {{ formatCurrency(goal.target_value) }}
          </span>
        </div>
        <NTag
          size="small"
          round
          :bordered="true"
          :style="{ color: goal.color || '#8b5cf6', borderColor: `${goal.color || '#8b5cf6'}33` }"
        >
          {{ Math.round(percentage) }}%
        </NTag>
      </div>
    </template>

    <template #progress>
      <NProgress
        type="line"
        :percentage="Math.min(percentage, 100)"
        :show-indicator="false"
        :color="goal.color || '#8b5cf6'"
        :height="6"
      />
    </template>

    <template #footer-left>
      <div class="flex flex-col gap-0.5">
        <span class="label-micro">{{ percentage < 100 ? 'Faltam' : 'Objetivo' }}</span>
        <span
          class="text-base font-bold tabular-nums"
          :class="percentage >= 100 ? 'text-success-main dark:text-success-main-dark' : 'text-label-primary'"
        >
          {{
            percentage < 100
              ? formatCurrency(BigInt(goal.target_value) - BigInt(goal.current_value))
              : 'Conquistado!'
          }}
        </span>
      </div>
    </template>

    <template #footer-right>
      <NTag size="small" round :bordered="false">
        <template #icon><i class="i-lucide-calendar-days text-xs"></i></template>
        <span class="text-xs text-label-secondary">{{ formatDate(goal.created_at) }}</span>
      </NTag>
    </template>
  </DataCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTag, NProgress } from 'naive-ui'
import type { IGoal } from '@/modules/goals/core/entities/IGoal'
import DataCard from './DataCard.vue'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'

const props = defineProps<{
  goal: IGoal
}>()

const percentage = computed(() => {
  if (props.goal.target_value <= 0n) return 0
  return (Number(props.goal.current_value) / Number(props.goal.target_value)) * 100
})

const formatCurrency = (value: number | bigint) => {
  const num = typeof value === 'bigint' ? Number(value) / 100 : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '---'
  return new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).toUpperCase()
}
</script>
