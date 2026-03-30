<template>
  <div class="summary-item flex items-center gap-5 transition-all duration-300 group">
    <!-- Icon area -->
    <BaseIconBox :color="color" size="md" class="group-hover:scale-105 transition-transform duration-300">
      <slot name="icon" />
    </BaseIconBox>
    
    <!-- Text area -->
    <div class="summary-text flex flex-col gap-1">
      <span class="label text-[0.8125rem] font-black text-text-disabled uppercase tracking-widest leading-none">
        {{ label }}
      </span>
      <strong 
        class="value text-[1.5rem] font-extrabold text-text-primary leading-tight tracking-tight transition-colors duration-300"
        :class="statusClass"
      >
        {{ value }}
      </strong>
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
