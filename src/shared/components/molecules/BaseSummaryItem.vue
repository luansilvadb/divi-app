<template>
  <div class="summary-item flex items-center gap-5 transition-all duration-300 group" :class="{ 'opacity-50 grayscale cursor-not-allowed': error }">
    <!-- Icon area -->
    <BaseIconBox :color="error ? 'error' : color" size="md" class="group-hover:scale-105 transition-transform duration-300">
      <slot name="icon">
        <svg v-if="error" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </slot>
    </BaseIconBox>
    
    <!-- Text area -->
    <div class="summary-text flex flex-col gap-1 min-w-0">
      <span class="label text-[0.8125rem] font-black text-text-disabled uppercase tracking-widest leading-none truncate">
        {{ error ? 'Erro de carga' : label }}
      </span>
      <strong 
        v-if="!error"
        class="value text-[1.5rem] font-extrabold text-text-primary leading-tight tracking-tight transition-colors duration-300 truncate"
        :class="statusClass"
      >
        {{ value }}
      </strong>
      <span v-else class="text-error-main text-xs font-bold animate-pulse-error">Indisponível</span>
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

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  color?: string
  status?: UIStatus
  error?: boolean
}>(), {
  status: 'normal'
})

const statusClass = computed(() => {
  switch (props.status) {
    case 'success': return 'text-success-main'
    case 'error': return 'text-error-main'
    case 'warning': return 'text-warning-main'
    case 'info': return 'text-primary-main'
    default: return 'text-text-primary'
  }
})
</script>
