<template>
  <NCard hoverable class="cursor-pointer" v-bind="$attrs">
    <NSpace vertical :size="20">
      <!-- Header -->
      <NSpace justify="space-between" align="center" class="w-full">
        <NSpace align="center" :size="12">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <i class="i-lucide-line-chart text-lg"></i>
          </div>
          <NSpace vertical :size="2">
            <NSpace align="center" :size="6">
              <NText strong class="text-base">{{ budget.name || categoryName }}</NText>
              <ItemSyncIndicator :status="budget.sync_status" />
            </NSpace>
            <NTag size="tiny" type="info" round :bordered="false">Mensal</NTag>
          </NSpace>
        </NSpace>
      </NSpace>

      <!-- Values -->
      <NSpace vertical :size="8">
        <NSpace justify="space-between" align="end">
          <NSpace align="baseline" :size="8">
            <NText
              strong
              class="text-2xl tabular-nums leading-none"
              :type="isOverBudget ? 'error' : 'default'"
            >
              {{ formatCurrency(consumed) }}
            </NText>
            <NText depth="3" class="text-sm">
              / {{ formatCurrency(budget.limit_value) }}
            </NText>
          </NSpace>
          <NTag
            size="small"
            :type="isOverBudget ? 'error' : 'default'"
            round
            :bordered="false"
          >
            {{ Math.round(percentage) }}%
          </NTag>
        </NSpace>

        <NProgress
          type="line"
          :percentage="Math.min(percentage, 100)"
          :show-indicator="false"
          :status="isOverBudget ? 'error' : 'success'"
          :height="6"
        />
      </NSpace>

      <!-- Footer Details -->
      <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <NSpace justify="space-between" align="center">
          <NSpace v-if="daysRemaining > 0 && !isOverBudget" align="center" :size="6">
            <NText depth="3" class="text-[9px] uppercase tracking-widest font-bold">Sugestão diária</NText>
            <NTag size="small" round :bordered="false">
              <NText strong class="text-xs">{{ formatCurrency(dailyCadence) }}</NText>
            </NTag>
          </NSpace>
          <NSpace v-else-if="isOverBudget" align="center" :size="6">
            <i class="i-lucide-alert-circle text-red-500 text-sm"></i>
            <NText type="error" class="text-[9px] uppercase tracking-widest font-bold">Orçamento estourado</NText>
          </NSpace>
          <NSpace v-else>
            <NText depth="3" class="text-[9px] uppercase tracking-widest font-bold">Finalizado</NText>
          </NSpace>

          <NTag size="small" round :bordered="false">
            <template #icon><i class="i-lucide-calendar-days text-xs"></i></template>
            <NText depth="3" class="text-xs">{{ daysRemaining }} dias</NText>
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
import type { Budget } from '@/shared/domain/entities/Budget'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'

const props = defineProps<{
  budget: Budget
  consumed: number
}>()

const transactionStore = useTransactionStore()

const categoryName = computed(() => {
  const cat = transactionStore.categoryMap[props.budget.category_id]
  return cat?.name || 'Categoria'
})

const percentage = computed(() => {
  const limitValue = Number(props.budget.limit_value)
  if (limitValue <= 0) return 0
  return (props.consumed / limitValue) * 100
})

const isOverBudget = computed(() => props.consumed > Number(props.budget.limit_value))

const daysRemaining = computed(() => {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const diffTime = lastDayOfMonth.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(diffDays, 0)
})

const dailyCadence = computed(() => {
  if (daysRemaining.value <= 0) return 0
  const limitValue = Number(props.budget.limit_value)
  const remaining = limitValue - props.consumed
  return Math.max(remaining / daysRemaining.value, 0)
})

const formatCurrency = (value: number | bigint) => {
  const val = Number(value) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val)
}
</script>
