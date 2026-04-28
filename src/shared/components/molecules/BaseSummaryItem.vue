<template>
  <div
    class="summary-item flex items-center gap-5 transition-all duration-150 ease-out"
    :class="{ 'opacity-50 grayscale cursor-not-allowed': error }"
  >
    <!-- Icon area -->
    <BaseIconBox
      :color="error ? '#ef4444' : color"
      size="md"
      class="transition-transform duration-150 ease-out"
    >
      <slot name="icon">
        <i v-if="error" class="i-lucide-alert-circle text-xl"></i>
      </slot>
    </BaseIconBox>

    <!-- Text area -->
    <div class="summary-text flex flex-col gap-0.5 min-w-0">
      <span
        class="label text-[10px] font-semibold uppercase tracking-widest leading-none truncate" :style="{ color: 'var(--text-tertiary)' }"
      >
        {{ error ? 'Erro de carga' : label }}
      </span>
      <strong
        v-if="!error"
        class="value text-2xl font-bold tracking-tight leading-tight transition-all duration-150 ease-out truncate" :style="{ color: 'var(--text-label)' }"
        :class="statusClass"
      >
        {{ value }}
      </strong>
      <span
        v-else
        class="text-red-500 text-[10px] font-black uppercase tracking-widest"
        >Indisponível</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
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
    color: '#007AFF'
  },
)

const statusClass = computed(() => {
  switch (props.status) {
    case 'success':
      return '!text-[#34C759]'
    case 'error':
      return '!text-[#FF3B30]'
    case 'warning':
      return '!text-[#FF9500]'
    case 'info':
      return '!text-[#007AFF]'
    default:
      return ''
  }
})
</script>
