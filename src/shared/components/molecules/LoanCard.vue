<template>
  <NCard hoverable class="cursor-pointer" v-bind="$attrs">
    <NSpace vertical :size="20">
      <!-- Header -->
      <NSpace justify="space-between" align="start" class="w-full">
        <NSpace align="center" :size="12">
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <i class="i-lucide-briefcase text-lg"></i>
          </div>
          <NSpace vertical :size="2">
            <NText strong class="text-base leading-tight">{{ loan.name }}</NText>
            <NSpace align="center" :size="6">
              <ItemSyncIndicator :status="loan.sync_status" />
              <NText depth="3" class="text-[9px] uppercase tracking-widest font-bold">
                Vence: {{ formatDate(loan.due_date) }}
              </NText>
            </NSpace>
          </NSpace>
        </NSpace>
      </NSpace>

      <!-- Metrics Block -->
      <NCard embedded size="small" :bordered="false" class="!bg-zinc-100/50 dark:!bg-zinc-800/20">
        <NGrid :cols="2" :x-gap="16">
          <NGridItem>
            <NSpace vertical :size="4">
              <NText depth="3" class="text-[9px] uppercase tracking-widest font-bold">Saldo Devedor</NText>
              <NText type="error" strong class="text-lg tabular-nums leading-none">
                {{ formatCurrency(loan.remaining_value) }}
              </NText>
            </NSpace>
          </NGridItem>
          <NGridItem>
            <NSpace vertical :size="4">
              <NText depth="3" class="text-[9px] uppercase tracking-widest font-bold">Taxa Mensal</NText>
              <NTag size="small" type="info" round :bordered="false">
                {{ loan.interest_rate || '0' }}%
              </NTag>
            </NSpace>
          </NGridItem>
        </NGrid>
      </NCard>

      <!-- Progress -->
      <NSpace vertical :size="8">
        <NSpace justify="space-between" align="center">
          <NText depth="3" class="text-[10px] uppercase tracking-widest font-bold">
            {{ getProgress(loan).toFixed(1) }}% pago
          </NText>
          <NText depth="3" class="text-[10px] opacity-60 uppercase tracking-widest font-bold">
            de {{ formatCurrency(loan.total_value) }}
          </NText>
        </NSpace>
        <NProgress
          type="line"
          :percentage="Math.min(getProgress(loan), 100)"
          :show-indicator="false"
          color="#3b82f6"
          :height="6"
        />
      </NSpace>

      <!-- Footer Actions -->
      <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
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
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import {
  NCard,
  NSpace,
  NText,
  NTag,
  NProgress,
  NGrid,
  NGridItem,
  NButton,
} from 'naive-ui'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'
import type { Loan } from '../../domain/entities/Loan'

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
