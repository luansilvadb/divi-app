<template>
  <div
    role="button"
    tabindex="0"
    class="transaction-item flex items-center p-4 gap-4 cursor-pointer relative transition-all duration-300 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white/50 dark:bg-surface-main hover:bg-white/80 dark:hover:bg-[#1b2234] hover:shadow-xl hover:shadow-black/5 group mb-2 last:mb-0 outline-hidden focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <!-- Left Section: Icon -->
    <div class="flex-shrink-0 relative">
      <div
        class="w-14 h-14 rounded-full flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-105"
        :style="{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent), var(--color-bg-main)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)',
        }"
      >
        <img
          v-if="categoryIcon"
          :src="sanitizedCategoryIcon"
          class="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
          @error="handleImageError"
        />
        <component v-else :is="iconComponent" class="w-7 h-7 text-accent-main" />
      </div>

      <!-- Transaction Type Indicator (Small Overlay) -->
      <div
        class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-surface-main z-20 flex items-center justify-center shadow-lg"
        :class="transaction.type === 'income' ? 'bg-success-main' : 'bg-error-main'"
      >
        <svg
          v-if="transaction.type === 'income'"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>

    <!-- Center Section: Title + Tags -->
    <div class="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
      <div class="flex items-center gap-2">
        <span
          class="font-extrabold text-text-primary text-[1.1rem] leading-tight truncate tracking-tight"
        >
          {{ transaction.title || 'Sem título' }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Wallet Tag -->
        <div
          v-if="walletName"
          class="px-3 py-1 rounded-lg bg-black/20 dark:bg-white/5 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary border border-white/5"
        >
          {{ walletName }}
        </div>

        <!-- Category Tag -->
        <div
          class="px-3 py-1 rounded-lg bg-black/20 dark:bg-white/5 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary border border-white/5"
        >
          {{ categoryName }}
        </div>

        <!-- Time Tag -->
        <div
          v-if="showTime"
          class="px-3 py-1 rounded-lg bg-black/20 dark:bg-white/5 text-[0.65rem] font-black uppercase tracking-widest text-text-secondary border border-white/5"
        >
          {{ formatTime(transaction.date) }}
        </div>
      </div>
    </div>

    <!-- Right Section: Amount -->
    <div class="flex items-center gap-4">
      <div class="text-right">
        <span
          class="font-black text-xl tracking-tighter transition-all duration-300"
          :class="transaction.type === 'expense' ? 'text-error-main' : 'text-success-main'"
        >
          {{ transaction.type === 'expense' ? '-' : '+' }} {{ formatCurrency(transaction.amount) }}
        </span>
      </div>

      <!-- Quick Actions -->
      <div
        class="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 group-focus-within:translate-x-0 hidden md:block"
      >
        <button
          aria-label="Excluir transação"
          class="w-10 h-10 rounded-full flex items-center justify-center text-text-disabled hover:bg-error-main/10 hover:text-error-main transition-all active:scale-90 outline-hidden focus-visible:ring-2 focus-visible:ring-error-main"
          @click.stop="$emit('delete', transaction.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
