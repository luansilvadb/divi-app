<template>
  <div
    class="summary-item flex items-center gap-5 transition-all duration-300"
    :class="{ 'opacity-50 grayscale cursor-not-allowed': error }"
  >
    <!-- Icon area -->
    <BaseIconBox
      :color="error ? '#ef4444' : color"
      size="md"
      class="transition-transform duration-300"
    >
      <slot name="icon">
        <i v-if="error" class="i-lucide-alert-circle text-xl"></i>
      </slot>
    </BaseIconBox>

    <!-- Text area -->
    <div class="summary-text flex flex-col gap-0.5 min-w-0">
      <span
        class="label text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none truncate"
      >
        {{ error ? 'Erro de carga' : label }}
      </span>
      <strong
        v-if="!error"
        class="value text-2xl font-black text-zinc-800 dark:text-zinc-50 leading-tight tracking-tighter transition-all duration-300 truncate"
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
    color: '#8b5cf6'
  },
)

const statusClass = computed(() => {
  switch (props.status) {
    case 'success':
      return '!text-emerald-500'
    case 'error':
      return '!text-red-500'
    case 'warning':
      return '!text-amber-500'
    case 'info':
      return '!text-violet-500'
    default:
      return ''
  }
})
</script>
