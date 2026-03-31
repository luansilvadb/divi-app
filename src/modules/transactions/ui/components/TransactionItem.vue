<template>
  <div
    class="transaction-item flex items-center p-4 gap-4 cursor-pointer relative transition-all duration-300 border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/2 dark:hover:bg-white/2 group"
    @click="$emit('click')"
  >
    <div class="item-left flex items-center gap-4 flex-1 min-w-0">
      <BaseIconBox :color="iconColor" size="md" class="flex-shrink-0">
        <component :is="iconComponent" class="w-5 h-5" />
      </BaseIconBox>

      <div class="t-main min-w-0 flex flex-col gap-0.5">
        <div class="t-title-row flex items-center gap-2">
          <span class="t-title font-bold text-text-primary text-sm truncate tracking-tight">{{
            transaction.title
          }}</span>
          <BaseBadge
            v-if="walletName"
            status="normal"
            variant="subtle"
            class="scale-75 origin-left"
          >
            {{ walletName }}
          </BaseBadge>
        </div>
        <div class="t-details-row flex items-center gap-2">
          <div
            class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-black uppercase tracking-widest"
            :style="{
              backgroundColor: categoryColor + '15',
              color: categoryColor,
            }"
          >
            <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: categoryColor }"></div>
            {{ categoryName }}
          </div>
          <span
            v-if="showTime"
            class="text-[0.65rem] font-bold text-text-disabled uppercase tracking-widest"
          >
            {{ formatTime(transaction.date) }}
          </span>
        </div>
      </div>
    </div>

    <div class="t-meta flex items-center gap-4">
      <span
        :class="[
          'font-black text-sm tracking-tight',
          transaction.type === 'expense' ? 'text-text-primary' : 'text-success-main',
        ]"
      >
        {{ transaction.type === 'expense' ? '-' : '+' }} {{ formatCurrency(transaction.amount) }}
      </span>

      <div class="item-actions opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-error-main/10 hover:text-error-main transition-colors"
          title="Excluir"
          @click.stop="$emit('delete', transaction.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, h } from 'vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseBadge from '@/shared/components/atoms/BaseBadge.vue'
import type { Transaction } from '@/shared/domain/entities/Transaction'

const props = defineProps<{
  transaction: Transaction
  categoryName: string
  categoryColor: string
  walletName?: string
  showTime?: boolean
}>()

defineEmits(['click', 'delete'])

const iconColor = computed(() => {
  return props.transaction.type === 'income'
    ? 'var(--color-success-main)'
    : 'var(--color-error-main)'
})

const iconComponent = computed(() => {
  return props.transaction.type === 'income'
    ? defineAsyncComponent(() =>
        Promise.resolve({
          render: () => {
            return h(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2.5',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
              },
              [h('path', { d: 'M12 19V5M5 12l7-7 7 7' })],
            )
          },
        }),
      )
    : defineAsyncComponent(() =>
        Promise.resolve({
          render: () => {
            return h(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2.5',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
              },
              [h('path', { d: 'M12 5v14M5 12l7 7 7-7' })],
            )
          },
        }),
      )
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>
