<template>
  <div class="summary-panels grid grid-cols-1 gap-5">
    <!-- Vencidos -->
    <BaseCard class="summary-item" clickable>
      <header class="summary-header flex items-center gap-3 mb-3">
            <BaseIconBox color="var(--color-error-main)" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
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
              class="summary-title text-[0.75rem] font-bold text-text-secondary uppercase tracking-widest"
              >Vencidos</span
            >
          </header>
          <div class="summary-body">
            <h4 class="summary-amount text-xl font-extrabold text-text-primary m-0 leading-tight">
              {{ formatCurrency(overdueAmount) }}
            </h4>
            <span class="summary-detail text-[0.75rem] font-semibold text-text-disabled"
              >{{ overdueCount }} transações atrasadas</span
            >
          </div>
    </BaseCard>

    <!-- Próximos -->
    <BaseCard class="summary-item" clickable>
      <header class="summary-header flex items-center gap-3 mb-3">
            <BaseIconBox color="var(--color-info-main)" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
            <span
              class="summary-title text-[0.75rem] font-bold text-text-secondary uppercase tracking-widest"
              >Próximos</span
            >
          </header>
          <div class="summary-body">
            <h4 class="summary-amount text-xl font-extrabold text-text-primary m-0 leading-tight">
              {{ formatCurrency(futureAmount) }}
            </h4>
            <span class="summary-detail text-[0.75rem] font-semibold text-text-disabled"
              >Próximos 7 dias</span
            >
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
