<template>
  <div
    class="summary-item flex items-center gap-5 transition-all duration-300"
    :class="{ 'opacity-50 grayscale cursor-not-allowed': error }"
  >
    <!-- Icon area -->
    <BaseIconBox
      :color="error ? 'error' : color"
      size="md"
      class="transition-transform duration-300"
    >
      <slot name="icon">
        <i v-if="error" class="pi pi-exclamation-circle text-xl"></i>
      </slot>
    </BaseIconBox>

    <!-- Text area -->
    <div class="summary-text flex flex-col gap-0.5 min-w-0">
      <span
        class="label text-[0.65rem] font-black text-surface-600 dark:text-surface-200 uppercase tracking-[0.15em] leading-none truncate opacity-80"
      >
        {{ error ? 'Erro de carga' : label }}
      </span>
      <strong
        v-if="!error"
        class="value text-2xl font-black text-surface-800 dark:text-surface-50 leading-tight tracking-tighter transition-all duration-300 truncate"
        :class="statusClass"
      >
        {{ value }}
      </strong>
      <span
        v-else
        class="text-error text-xs font-black animate-pulse-error uppercase tracking-widest"
        >Indisponível</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseSummaryItem Molecule
 * Displays a value with a label and an optional icon.
 */
import { computed } from 'vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import type { UIStatus } from '@/shared/types/ui'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    color?: string
    status?: UIStatus
    error?: boolean
  }>(),
  {
    status: 'normal',
  },
)

const statusClass = computed(() => {
  switch (props.status) {
    case 'success':
      return 'text-success-main'
    case 'error':
      return 'text-error'
    case 'warning':
      return 'text-warning-main'
    case 'info':
      return 'text-primary'
    default:
      return 'text-surface-800 dark:text-surface-50'
  }
})
</script>

