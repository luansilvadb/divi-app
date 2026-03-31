<template>
  <div
    class="transaction-item flex items-center p-4 gap-4 cursor-pointer relative transition-all duration-300 rounded-2xl border border-transparent hover:border-black/5 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-xl hover:shadow-black/2 group mb-1 last:mb-0"
    @click="$emit('click')"
  >
    <!-- Left Section: Icon + Description -->
    <div class="item-left flex items-center gap-4 flex-1 min-w-0">
      <div class="relative">
        <BaseIconBox :color="categoryColor" size="md" class="flex-shrink-0 relative z-10 shadow-sm transition-transform duration-300">
          <img
            v-if="categoryIcon"
            :src="sanitizedCategoryIcon"
            class="w-5 h-5 object-contain"
            @error="handleImageError"
          />
          <component v-else :is="iconComponent" class="w-5 h-5" />
        </BaseIconBox>
        
        <!-- Transaction Type Indicator (Tiny Dot) -->
        <div 
          class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface-main z-20 flex items-center justify-center shadow-xs"
          :class="transaction.type === 'income' ? 'bg-success-main' : 'bg-error-main'"
        >
          <svg v-if="transaction.type === 'income'" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </div>

      <div class="t-main min-w-0 flex flex-col gap-1">
        <div class="t-title-row flex items-center gap-2">
          <span class="t-title font-black text-text-primary text-[0.95rem] leading-tight truncate tracking-tight">{{
            transaction.title || 'Sem título'
          }}</span>
        </div>
        <div class="t-details-row flex items-center gap-2.5">
          <!-- Category Pill -->
          <div
            class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-wider border border-black/5 dark:border-white/5"
            :style="{
              backgroundColor: categoryColor + '15',
              color: categoryColor,
              borderColor: categoryColor + '25'
            }"
          >
            {{ categoryName }}
          </div>
          
          <div class="flex items-center gap-2 text-text-secondary">
            <!-- Wallet Tag -->
            <span
              v-if="walletName"
              class="text-[0.7rem] font-bold uppercase tracking-widest flex items-center gap-1.5"
            >
              <div class="w-1 h-1 rounded-full bg-text-disabled/40"></div>
              {{ walletName }}
            </span>

            <!-- Time -->
            <span
              v-if="showTime"
              class="text-[0.7rem] font-bold uppercase tracking-widest flex items-center gap-1.5"
            >
              <div class="w-1 h-1 rounded-full bg-text-disabled/40"></div>
              {{ formatTime(transaction.date) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section: Amount + Actions -->
    <div class="t-meta flex items-center gap-6">
      <div class="text-right flex flex-col items-end">
        <span
          :class="[
            'font-black text-lg tracking-tighter transition-all duration-300',
            transaction.type === 'expense' ? 'text-text-primary' : 'text-success-main',
          ]"
        >
          {{ transaction.type === 'expense' ? '-' : '+' }} {{ formatCurrency(transaction.amount) }}
        </span>
      </div>

      <div class="item-actions flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <button
          class="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-error-main/10 hover:text-error-main transition-all active:scale-90"
          title="Excluir"
          @click.stop="$emit('delete', transaction.id)"
        >
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
import type { Transaction } from '@/shared/domain/entities/Transaction'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'

const assetLoader = container.resolve<IAssetLoader>(DI_TOKENS.AssetLoader)

const props = defineProps<{
  transaction: Transaction
  categoryName: string
  categoryColor: string
  categoryIcon?: string
  walletName?: string
  showTime?: boolean
}>()

defineEmits(['click', 'delete'])

const sanitizedCategoryIcon = computed(() => {
  return assetLoader.sanitize(props.categoryIcon)
})

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = assetLoader.getFallback('category')
}

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
