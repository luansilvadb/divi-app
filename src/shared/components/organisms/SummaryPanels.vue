<template>
  <div class="summary-panels grid grid-cols-1 gap-6">
    <!-- Vencidos -->
    <BaseCard class="relative border-l-4 border-l-error-main !px-6 shadow-sm">
      <div class="flex items-start justify-between mb-4">
        <BaseIconBox color="var(--color-error-main)" size="sm" class="shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </BaseIconBox>
        <span
          class="text-[10px] font-black uppercase text-error-main bg-error-main/5 px-2 py-1 rounded-md tracking-widest border border-error-main/10"
          >Vencidos</span
        >
      </div>

      <div class="summary-body space-y-1">
        <h4 class="text-2xl font-black text-text-primary tracking-tighter">
          {{ formatCurrency(overdueAmount) }}
        </h4>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-error-main animate-pulse"></span>
          <span class="text-xs font-bold text-text-secondary tracking-tight"
            >{{ overdueCount }} transações pendentes</span
          >
        </div>
      </div>
    </BaseCard>

    <!-- Próximos -->
    <BaseCard class="relative border-l-4 border-l-info-main !px-6 shadow-sm">
      <div class="flex items-start justify-between mb-4">
        <BaseIconBox color="var(--color-info-main)" size="sm" class="shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </BaseIconBox>
        <span
          class="text-[10px] font-black uppercase text-info-main bg-info-main/5 px-2 py-1 rounded-md tracking-widest border border-info-main/10"
          >Próximos</span
        >
      </div>

      <div class="summary-body space-y-1">
        <h4 class="text-2xl font-black text-text-primary tracking-tighter">
          {{ formatCurrency(futureAmount) }}
        </h4>
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-info-main opacity-50"></span>
          <span class="text-xs font-bold text-text-secondary tracking-tight"
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
