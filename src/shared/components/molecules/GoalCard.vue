<template>
  <NCard hoverable class="cursor-pointer" v-bind="$attrs">
    <NSpace vertical :size="20">
      <!-- Header -->
      <NSpace justify="space-between" align="center" class="w-full">
        <NSpace align="center" :size="12">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            :style="{ backgroundColor: `${goal.color || '#8b5cf6'}1A`, color: goal.color || '#8b5cf6' }"
          >
            <span v-if="goal.icon" class="leading-none">{{ goal.icon }}</span>
            <i v-else class="i-lucide-target"></i>
          </div>
          <NSpace vertical :size="2">
            <NSpace align="center" :size="6">
              <NText strong class="text-base">{{ goal.name }}</NText>
              <ItemSyncIndicator :status="goal.sync_status" />
            </NSpace>
            <NTag size="tiny" :color="{ textColor: goal.color || '#8b5cf6', borderColor: 'transparent', color: `${goal.color || '#8b5cf6'}1A` }" round :bordered="false">
              {{ goal.type === 'saving' ? 'Acumular' : 'Quitação' }}
            </NTag>
          </NSpace>
        </NSpace>
      </NSpace>

      <!-- Values -->
      <NSpace vertical :size="8">
        <NSpace justify="space-between" align="end">
          <NSpace align="baseline" :size="8">
            <NText strong class="text-2xl tabular-nums leading-none">
              {{ formatCurrency(goal.current_value) }}
            </NText>
            <NText depth="3" class="text-sm">
              / {{ formatCurrency(goal.target_value) }}
            </NText>
          </NSpace>
          <NTag
            size="small"
            round
            :bordered="true"
            :style="{ color: goal.color || '#8b5cf6', borderColor: `${goal.color || '#8b5cf6'}33` }"
          >
            {{ Math.round(percentage) }}%
          </NTag>
        </NSpace>

        <NProgress
          type="line"
          :percentage="Math.min(percentage, 100)"
          :show-indicator="false"
          :color="goal.color || '#8b5cf6'"
          :height="6"
        />
      </NSpace>

      <!-- Footer Details -->
      <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <NSpace justify="space-between" align="center">
          <NSpace vertical :size="0">
            <NText depth="3" class="text-[9px] font-bold uppercase tracking-widest">
              {{ percentage < 100 ? 'Faltam' : 'Objetivo' }}
            </NText>
            <NText
              strong
              class="text-base tabular-nums"
              :type="percentage >= 100 ? 'success' : 'default'"
            >
              {{
                percentage < 100
                  ? formatCurrency(BigInt(goal.target_value) - BigInt(goal.current_value))
                  : 'Conquistado!'
              }}
            </NText>
          </NSpace>

          <NTag size="small" round :bordered="false">
            <template #icon><i class="i-lucide-calendar-days text-xs"></i></template>
            <NText depth="3" class="text-xs">{{ formatDate(goal.created_at) }}</NText>
          </NTag>
        </NSpace>
      </div>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NCard,
  NSpace,
  NText,
  NTag,
  NProgress,
} from 'naive-ui'
import type { Goal } from '../../domain/entities/Goal'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'

const props = defineProps<{
  goal: Goal
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
