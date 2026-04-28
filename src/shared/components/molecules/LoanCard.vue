<template>
  <DataCard hoverable clickable v-bind="$attrs">
    <template #header-left>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-info-subtle dark:bg-info-subtle-dark flex items-center justify-center text-info-main dark:text-info-main-dark">
          <i class="i-lucide-briefcase text-lg"></i>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="card-title leading-tight">{{ loan.name }}</span>
          <div class="flex items-center gap-2">
            <ItemSyncIndicator :status="loan.sync_status" />
            <span class="label-micro">
              Vence: {{ formatDate(loan.due_date) }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #extra-content>
      <NCard embedded size="small" :bordered="false" class="!bg-surface-200/50 dark:!bg-surface-200-dark/20">
        <NGrid :cols="2" :x-gap="16">
          <NGridItem>
            <div class="flex flex-col gap-1">
              <span class="label-micro">Saldo Devedor</span>
              <span class="text-lg font-bold tabular-nums leading-none text-error-main dark:text-error-main-dark">
                {{ formatCurrency(loan.remaining_value) }}
              </span>
            </div>
          </NGridItem>
          <NGridItem>
            <div class="flex flex-col gap-1">
              <span class="label-micro">Taxa Mensal</span>
              <NTag size="small" type="info" round :bordered="false">
                {{ loan.interest_rate || '0' }}%
              </NTag>
            </div>
          </NGridItem>
        </NGrid>
      </NCard>
    </template>

    <template #progress>
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-widest text-label-secondary">
          {{ getProgress(loan).toFixed(1) }}% pago
        </span>
        <span class="text-[10px] font-bold uppercase tracking-widest text-label-quaternary">
          de {{ formatCurrency(loan.total_value) }}
        </span>
      </div>
      <NProgress
        type="line"
        :percentage="Math.min(getProgress(loan), 100)"
        :show-indicator="false"
        color="#3b82f6"
        :height="6"
      />
    </template>

    <template #footer-right>
      <div class="flex justify-end gap-3">
        <NButton
          quaternary
          size="small"
          type="error"
          strong
          round
          @click.stop="$emit('delete', loan.id)"
        >
          Remover
        </NButton>
        <NButton secondary size="small" type="primary" strong round>
          Registrar Parcela
        </NButton>
      </div>
    </template>
  </DataCard>
</template>

<script setup lang="ts">
import { NTag, NProgress, NGrid, NGridItem, NButton, NCard } from 'naive-ui'
import type { Loan } from '../../domain/entities/Loan'
import DataCard from './DataCard.vue'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'

defineProps<{
  loan: Loan
}>()

defineEmits<{
  (e: 'delete', id: string): void
}>()

const getProgress = (loan: Loan) => {
  if (BigInt(loan.total_value) === 0n) return 0
  const paid = Number(BigInt(loan.total_value) - BigInt(loan.remaining_value))
  return (paid / Number(loan.total_value)) * 100
}

const formatCurrency = (value: number | bigint) => {
  const num = typeof value === 'bigint' ? Number(value) / 100 : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}
</script>
