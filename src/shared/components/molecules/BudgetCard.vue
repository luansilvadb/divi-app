<template>
  <BaseCard class="budget-card hover-glow" clickable v-bind="$attrs">
    <template #header>
      <div class="header-content flex justify-between items-center w-full">
        <div class="budget-title-area flex items-center gap-4">
          <BaseIconBox color="#8b5cf6">
            <i class="i-lucide-line-chart text-xl"></i>
          </BaseIconBox>
          <span
            class="budget-name text-lg font-bold text-zinc-800 dark:text-zinc-50 tracking-tight"
          >
            {{ budget.name || categoryName }}
          </span>
          <ItemSyncIndicator :status="budget.sync_status" />
        </div>

        <BaseBadge status="info" variant="subtle"> Mensal </BaseBadge>
      </div>
    </template>

    <div class="budget-info flex flex-col gap-5 pt-2">
      <div class="values-row flex justify-between items-end">
        <div class="values-main flex items-baseline gap-1.5">
          <span
            class="consumed text-3xl font-black text-zinc-800 dark:text-zinc-50 tracking-tighter"
            :class="{ '!text-red-500': isOverBudget }"
            >{{ formatCurrency(consumed) }}</span
          >
          <span class="limit text-base font-medium text-zinc-400"
            >/ {{ formatCurrency(budget.limit_value) }}</span
          >
        </div>
        <div
          class="percentage-pill text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded-lg"
          :class="{ '!bg-red-500/10 !text-red-500': isOverBudget }"
        >
          {{ Math.round(percentage) }}%
        </div>
      </div>

      <BudgetProgressBar :spent="consumed" :limit="budget.limit_value" />

      <div
        class="budget-footer-details flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800"
      >
        <div
          class="cadence flex items-center gap-2 text-xs"
          v-if="daysRemaining > 0 && !isOverBudget"
        >
          <span class="cadence-label text-zinc-400 font-bold uppercase tracking-widest text-[9px]"
            >Sugestão diária:</span
          >
          <span
            class="cadence-value font-black text-zinc-800 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md"
          >
            {{ formatCurrency(dailyCadence) }}
          </span>
        </div>
        <div
          class="cadence over-alert flex items-center gap-2 text-xs text-red-500 font-bold uppercase tracking-widest text-[9px]"
          v-else-if="isOverBudget"
        >
          <i class="i-lucide-alert-circle text-sm"></i>
          <span>Orçamento estourado</span>
        </div>

        <div
          class="days-remaining flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg"
        >
          <i class="i-lucide-calendar-days text-sm"></i>
          {{ daysRemaining }} dias
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseBadge from '@/shared/components/atoms/BaseBadge.vue'
import BudgetProgressBar from '@/modules/budgets/ui/components/BudgetProgressBar.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
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
  if (props.budget.limit_value <= 0) return 0
  return (props.consumed / props.budget.limit_value) * 100
})

const isOverBudget = computed(() => props.consumed > props.budget.limit_value)

const daysRemaining = computed(() => {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const diffTime = lastDayOfMonth.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(diffDays, 0)
})

const dailyCadence = computed(() => {
  if (daysRemaining.value <= 0) return 0
  const remaining = props.budget.limit_value - props.consumed
  return Math.max(remaining / daysRemaining.value, 0)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
</script>
