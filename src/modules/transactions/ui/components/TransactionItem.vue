<template>
  <NCard
    hoverable
    class="cursor-pointer mb-2 last:mb-0 transition-transform active:scale-[0.99] w-full"
    size="small"
    @click="$emit('click')"
  >
    <div class="flex items-center justify-between gap-3 w-full">
      <!-- Left Section: Icon + Info -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="relative shrink-0">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center border border-separator bg-surface-secondary text-xl"
          >
            <img
              v-if="categoryIcon"
              :src="sanitizedCategoryIcon"
              class="w-6 h-6 object-contain"
              @error="handleImageError"
            />
            <i v-else class="i-lucide-banknote text-tertiary"></i>
          </div>

          <div
            class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-surface-primary flex items-center justify-center"
            :class="getBadgeClass()"
          >
            <i :class="getArrowIcon()" class="text-[10px] text-white font-bold"></i>
          </div>
        </div>

        <div class="flex flex-col min-w-0 flex-1 gap-0.5">
          <div class="flex items-center gap-1.5 min-w-0">
            <NText strong class="text-base truncate">{{ transaction.title || 'Sem título' }}</NText>
            <ItemSyncIndicator :status="transaction.sync_status || 'pending'" />
          </div>

          <div class="flex items-center gap-1.5 overflow-hidden">
            <NTag size="tiny" round :bordered="false" class="shrink-0">{{ walletName || 'Conta' }}</NTag>
            <NTag
              size="tiny"
              round
              :bordered="false"
              class="shrink-0"
              :style="getCategoryStyle()"
            >
              {{ getCategoryLabel() }}
            </NTag>
            <NText v-if="showTime" depth="3" class="text-[10px] uppercase tracking-widest font-bold shrink-0 truncate">
              {{ formatTime(transaction.date) }}
            </NText>
          </div>
        </div>
      </div>

      <!-- Right Section: Value -->
      <div class="flex items-center gap-2 shrink-0">
        <NText
          strong
          class="text-lg tabular-nums tracking-tight whitespace-nowrap"
          :type="getValueType()"
        >
          {{ getSign() }} {{ formatCurrency(transaction.amount < 0n ? -transaction.amount : transaction.amount) }}
        </NText>

        <NButton
          quaternary
          circle
          type="error"
          class="opacity-0 hover:opacity-100 transition-opacity"
          @click.stop="$emit('delete', transaction.id)"
        >
          <template #icon><i class="i-lucide-trash-2"></i></template>
        </NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NText, NTag, NButton } from 'naive-ui'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IAssetLoader } from '@/shared/domain/contracts/IAssetLoader'
import { formatCurrency } from '@/shared/utils/formatters'

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
  target.src = assetLoader.getFallback()
}

function formatTime(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function getBadgeClass() {
  if (props.transaction.type === 'transfer') {
    return 'bg-tertiary'
  }
  return props.transaction.type === 'income' ? 'bg-success' : 'bg-error'
}

function getArrowIcon() {
  if (props.transaction.type === 'transfer') {
    return 'i-lucide-arrow-left-right'
  }
  return props.transaction.type === 'income' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'
}

function getCategoryStyle() {
  if (props.transaction.type === 'transfer') {
    return { color: '#6b7280', backgroundColor: '#6b72801A' }
  }
  return { color: props.categoryColor, backgroundColor: `${props.categoryColor}1A` }
}

function getCategoryLabel() {
  if (props.transaction.type === 'transfer') {
    return 'Transferência'
  }
  return props.categoryName
}

function getValueType() {
  if (props.transaction.type === 'transfer') {
    return 'info'
  }
  return props.transaction.type === 'expense' ? 'error' : 'success'
}

function getSign() {
  if (props.transaction.type === 'transfer') {
    return ''
  }
  return props.transaction.type === 'expense' ? '-' : '+'
}
</script>
