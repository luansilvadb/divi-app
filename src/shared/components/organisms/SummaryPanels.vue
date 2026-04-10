<template>
  <div class="summary-panels grid grid-cols-1 gap-6">
    <!-- Vencidos -->
    <BaseCard class="relative border-l-4 border-l-error-main !px-6 shadow-sm">
      <div class="flex items-start justify-between mb-4">
        <BaseIconBox color="var(--color-error-main)" size="sm" class="shadow-sm">
          <i class="pi pi-exclamation-triangle text-xs"></i>
        </BaseIconBox>
        <span
          class="text-[10px] font-black uppercase text-error bg-error/5 px-2 py-1 rounded-md tracking-widest border border-error-main/10"
          >Vencidos</span
        >
      </div>

      <div class="summary-body space-y-1">
        <h4 class="text-2xl font-black text-surface-800 dark:text-surface-50 tracking-tighter">
          {{ formatCurrency(overdueAmount) }}
        </h4>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
          <span class="text-xs font-bold text-surface-600 dark:text-surface-200 tracking-tight"
            >{{ overdueCount }} transações pendentes</span
          >
        </div>
      </div>
    </BaseCard>

    <!-- Próximos -->
    <BaseCard class="relative border-l-4 border-l-info-main !px-6 shadow-sm">
      <div class="flex items-start justify-between mb-4">
        <BaseIconBox color="var(--color-info-main)" size="sm" class="shadow-sm">
          <i class="pi pi-clock text-xs"></i>
        </BaseIconBox>
        <span
          class="text-[10px] font-black uppercase text-info-main bg-info-main/5 px-2 py-1 rounded-md tracking-widest border border-info-main/10"
          >Próximos</span
        >
      </div>

      <div class="summary-body space-y-1">
        <h4 class="text-2xl font-black text-surface-800 dark:text-surface-50 tracking-tighter">
          {{ formatCurrency(futureAmount) }}
        </h4>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-info-main opacity-50"></span>
          <span class="text-xs font-bold text-surface-600 dark:text-surface-200 tracking-tight"
            >Compromisso nos próximos 7 dias</span
          >
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'

defineProps<{
  overdueAmount: number
  overdueCount: number
  futureAmount: number
}>()

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}
</script>

