<template>
  <div
    role="button"
    tabindex="0"
    class="transaction-item flex items-center p-3 sm:p-4 gap-3 sm:gap-4 cursor-pointer relative transition-all duration-300 rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-200 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-2xl hover:shadow-violet-500/5 group mb-2 last:mb-0 outline-none active:scale-[0.98]"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <!-- Left Section: Icon -->
    <div class="flex-shrink-0 relative">
      <div
        class="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
      >
        <img
          v-if="categoryIcon"
          :src="sanitizedCategoryIcon"
          class="w-5 h-5 sm:w-7 sm:h-7 object-contain"
          @error="handleImageError"
        />
        <i v-else class="i-lucide-banknote text-lg sm:text-xl text-zinc-400"></i>
      </div>

      <!-- Transaction Type Indicator -->
      <div
        class="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-zinc-950 z-20 flex items-center justify-center shadow-md"
        :class="transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'"
      >
        <i :class="transaction.type === 'income' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'" class="text-[8px] sm:text-[10px] text-white font-black"></i>
      </div>
    </div>

    <!-- Center Section -->
    <div class="flex-1 min-w-0 flex flex-col justify-center gap-1">
      <div class="flex items-center gap-2">
        <span
          class="font-bold text-zinc-800 dark:text-zinc-50 text-[0.95rem] sm:text-[1rem] leading-tight truncate tracking-tight"
        >
          {{ transaction.title || 'Sem título' }}
        </span>
        <ItemSyncIndicator :status="transaction.sync_status" />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded shadow-sm">
          {{ walletName || 'Conta' }}
        </span>
        <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm border border-zinc-100 dark:border-zinc-800"
              :style="{ color: categoryColor, backgroundColor: `${categoryColor}10` }">
          {{ categoryName }}
        </span>
        <span v-if="showTime" class="text-[9px] font-black uppercase tracking-widest text-zinc-400 opacity-60">
          {{ formatTime(transaction.date) }}
        </span>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
      <div class="text-right">
        <span
          class="font-black text-[1rem] sm:text-lg tracking-tighter"
          :class="transaction.type === 'expense' ? 'text-red-500' : 'text-emerald-500'"
        >
          {{ transaction.type === 'expense' ? '-' : '+' }} {{ formatCurrency(Math.abs(transaction.amount)) }}
        </span>
      </div>

      <NButton
        quaternary
        circle
        size="small"
        class="opacity-0 group-hover:opacity-100 transition-opacity !text-zinc-400 hover:!text-red-500 hover:!bg-red-500/10"
        @click.stop="$emit('delete', transaction.id)"
      >
        <template #icon><i class="i-lucide-trash-2"></i></template>
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'
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

const sanitizedCategoryIcon = computed(() => assetLoader.sanitize(props.categoryIcon))

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = assetLoader.getFallback('category')
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>
