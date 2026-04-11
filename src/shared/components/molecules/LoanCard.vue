<template>
  <BaseCard class="loan-card hover-glow" clickable>
    <div class="card-top flex justify-between items-start">
      <div class="loan-identity flex gap-4 items-center">
        <BaseIconBox color="#3b82f6" size="lg">
          <i class="i-lucide-briefcase text-2xl"></i>
        </BaseIconBox>
        <div class="flex flex-col gap-0.5">
          <h3
            class="loan-name text-lg font-bold text-zinc-800 dark:text-zinc-50 tracking-tight leading-tight"
          >
            {{ loan.name }}
          </h3>
          <div class="flex items-center gap-2">
            <ItemSyncIndicator :status="loan.sync_status" />
            <span class="loan-due text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
              >Vence: {{ formatDate(loan.due_date) }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="loan-metrics grid grid-cols-2 gap-4 bg-zinc-100/50 dark:bg-zinc-800/20 p-4 rounded-2xl mt-5 border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner"
    >
      <div class="metric flex flex-col gap-1">
        <span
          class="label text-[9px] font-bold text-zinc-400 uppercase tracking-widest"
          >Saldo Devedor</span
        >
        <span class="value text-lg font-black text-red-500 leading-none">{{
          formatCurrency(loan.remaining_value)
        }}</span>
      </div>
      <div class="metric flex flex-col gap-1">
        <span
          class="label text-[9px] font-bold text-zinc-400 uppercase tracking-widest"
          >Taxa Mensal</span
        >
        <div class="flex items-center">
          <BaseBadge variant="subtle" color="#8b5cf6">
            {{ loan.interest_rate || '0' }}%
          </BaseBadge>
        </div>
      </div>
    </div>

    <div class="loan-progress-section flex flex-col gap-2 mt-5">
      <div
        class="progress-info flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
      >
        <span>{{ getProgress(loan).toFixed(1) }}% pago</span>
        <span class="opacity-60">de {{ formatCurrency(loan.total_value) }}</span>
      </div>
      <BaseProgressBar :percentage="getProgress(loan)" color="#3b82f6" />
    </div>

    <div class="card-footer pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
      <div class="card-actions flex justify-end gap-3">
        <NButton
          quaternary
          size="small"
          class="!text-red-500 font-bold !rounded-xl"
          @click.stop="$emit('delete', loan.id)"
        >
          Remover
        </NButton>
        <NButton secondary size="small" class="!rounded-xl font-bold"> 
          Registrar Parcela 
        </NButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseBadge from '@/shared/components/atoms/BaseBadge.vue'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'
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
