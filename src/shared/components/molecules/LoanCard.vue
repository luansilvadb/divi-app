<template>
  <BaseCard class="loan-card" clickable>
    <div class="card-top flex justify-between items-start">
      <div class="loan-identity flex gap-4 items-center">
        <BaseIconBox color="var(--color-secondary-main)" size="lg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            width="24"
            height="24"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </BaseIconBox>
        <div class="flex flex-col gap-0.5">
          <h3 class="loan-name text-lg font-bold text-text-primary tracking-tight leading-tight">
            {{ loan.name }}
          </h3>
          <span class="loan-due text-xs font-semibold text-text-disabled"
            >Vence: {{ formatDate(loan.due_date) }}</span
          >
        </div>
      </div>
    </div>

    <div class="loan-metrics grid grid-cols-2 gap-4 bg-black/3 dark:bg-white/3 p-4 rounded-xl mt-4">
      <div class="metric flex flex-col gap-1">
        <span class="label text-[0.7rem] font-bold text-text-disabled uppercase tracking-widest"
          >Saldo Devedor</span
        >
        <span class="value text-lg font-black text-error-main leading-none">{{
          formatCurrency(loan.remaining_value)
        }}</span>
      </div>
      <div class="metric flex flex-col gap-1">
        <span class="label text-[0.7rem] font-bold text-text-disabled uppercase tracking-widest"
          >Taxa</span
        >
        <div class="flex items-center">
          <BaseBadge variant="subtle" color="var(--color-primary-main)">
            {{ loan.interest_rate || '0' }}% a.m.
          </BaseBadge>
        </div>
      </div>
    </div>

    <div class="loan-progress-section flex flex-col gap-2 mt-4">
      <div class="progress-info flex justify-between text-xs font-bold text-text-secondary">
        <span>{{ getProgress(loan).toFixed(1) }}% pago</span>
        <span class="opacity-60">de {{ formatCurrency(loan.total_value) }}</span>
      </div>
      <BaseProgressBar :percentage="getProgress(loan)" color="var(--color-primary-main)" />
    </div>

    <div class="card-footer pt-4 border-t border-black/5 dark:border-white/5 mt-2">
      <div class="card-actions flex justify-end gap-2">
        <BaseButton
          variant="ghost"
          class="!px-4 !py-1.5 text-xs text-error-main"
          @click="$emit('delete', loan.id)"
        >
          Remover
        </BaseButton>
        <BaseButton variant="outline" class="!px-4 !py-1.5 text-xs"> Registrar Parcela </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseBadge from '@/shared/components/atoms/BaseBadge.vue'
import type { Loan } from '../../domain/entities/Loan'

defineProps<{
  loan: Loan
}>()

defineEmits<{
  (e: 'delete', id: string): void
}>()

const getProgress = (loan: Loan) => {
  if (loan.total_value === 0) return 0
  const paid = loan.total_value - loan.remaining_value
  return (paid / loan.total_value) * 100
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}
</script>
