<template>
  <div
    role="button"
    tabindex="0"
    class="transaction-item flex items-center p-3 sm:p-4 gap-3 sm:gap-4 cursor-pointer relative transition-all duration-300 rounded-[1.5rem] sm:rounded-[2rem] border border-surface-200 dark:border-surface-800/10 bg-white/50 dark:bg-surface-700 hover:bg-white/80 dark:hover:bg-surface-700/80 hover:shadow-xl hover:shadow-black/5 group mb-2 last:mb-0 outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <!-- Left Section: Icon -->
    <div class="flex-shrink-0 relative">
      <div
        class="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-inner transition-transform duration-300"
        :style="{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent), var(--color-bg-main)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.3)',
        }"
      >
        <img
          v-if="categoryIcon"
          :src="sanitizedCategoryIcon"
          class="w-5 h-5 sm:w-7 sm:h-7 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
          @error="handleImageError"
        />
        <component v-else :is="iconComponent" class="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
      </div>

      <!-- Transaction Type Indicator (Small Overlay) -->
      <div
        class="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-surface-main z-20 flex items-center justify-center shadow-lg"
        :class="transaction.type === 'income' ? 'bg-success-main' : 'bg-error'"
      >
        <svg
          v-if="transaction.type === 'income'"
          xmlns="http://www.w3.org/2000/svg"
          class="w-2.5 h-2.5 sm:w-3 sm:h-3"
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
          class="w-2.5 h-2.5 sm:w-3 sm:h-3"
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
          class="font-extrabold text-surface-800 dark:text-surface-50 text-[0.95rem] sm:text-[1.1rem] leading-tight truncate tracking-tight"
        >
          {{ transaction.title || 'Sem título' }}
        </span>

        <!-- Sync Indicator -->
        <ItemSyncIndicator :status="transaction.sync_status" />
      </div>

      <!-- Mobile Tags (Inline text layout) -->
      <div
        class="flex sm:hidden items-center gap-1.5 text-[0.6rem] font-black uppercase tracking-widest text-surface-400 dark:text-surface-400 truncate"
      >
        <span v-if="walletName" class="truncate max-w-[65px]">{{ walletName }}</span>

        <span v-if="walletName" class="text-black/20 dark:text-white/20">&bull;</span>

        <span class="truncate max-w-[80px] text-surface-600 dark:text-surface-200">{{ categoryName }}</span>

        <template v-if="showTime">
          <span class="text-black/20 dark:text-white/20">&bull;</span>
          <span class="flex-shrink-0">{{ formatTime(transaction.date) }}</span>
        </template>
      </div>

      <!-- Desktop Tags (Pill layout) -->
      <div class="hidden sm:flex flex-wrap items-center gap-2">
        <!-- Wallet Tag -->
        <div
          v-if="walletName"
          class="px-3 py-1 rounded-lg bg-black/20 dark:bg-surface-800/10 text-[0.65rem] font-black uppercase tracking-widest text-surface-600 dark:text-surface-200 border border-surface-200/10"
        >
          {{ walletName }}
        </div>

        <!-- Category Tag -->
        <div
          class="px-3 py-1 rounded-lg bg-black/20 dark:bg-surface-800/10 text-[0.65rem] font-black uppercase tracking-widest text-surface-600 dark:text-surface-200 border border-surface-200/10"
        >
          {{ categoryName }}
        </div>

        <!-- Time Tag -->
        <div
          v-if="showTime"
          class="px-3 py-1 rounded-lg bg-black/20 dark:bg-surface-800/10 text-[0.65rem] font-black uppercase tracking-widest text-surface-600 dark:text-surface-200 border border-surface-200/10"
        >
          {{ formatTime(transaction.date) }}
        </div>
      </div>
    </div>

    <!-- Right Section: Amount -->
    <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
      <div class="text-right">
        <span
          class="font-black text-[1rem] sm:text-xl tracking-tighter transition-all duration-300"
          :class="transaction.type === 'expense' ? 'text-error' : 'text-success-main'"
        >
          {{ formatCurrency(transaction.amount) }}
        </span>
      </div>

      <!-- Quick Actions -->
      <div
        class="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 group-focus-within:translate-x-0 hidden md:block"
      >
        <button
          aria-label="Excluir transação"
          class="w-10 h-10 rounded-full flex items-center justify-center text-surface-400 dark:text-surface-400 hover:bg-error/10 hover:text-error transition-all active:scale-90 outline-hidden focus-visible:ring-2 focus-visible:ring-error-main cursor-pointer"
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
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'
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


