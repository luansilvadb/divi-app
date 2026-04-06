<template>
  <Button
    v-ripple
    :severity="primeSeverity"
    :outlined="variant === 'outline'"
    :text="variant === 'ghost'"
    :disabled="disabled || loading"
    :loading="loading"
    v-bind="$attrs"
    :class="[
      'font-bold rounded-xl transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main active:scale-95 px-6 py-2.5',
      { 'shadow-lg': !['outline', 'ghost'].includes(variant) },
      { '!bg-[#161D2C] hover:!bg-[#1e273a] !text-white !border-none': variant === 'primary' }
    ]"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
  disabled: false,
  loading: false
})

const primeSeverity = computed(() => {
  if (props.variant === 'danger') return 'danger'
  if (props.variant === 'secondary') return 'secondary'
  if (props.variant === 'ghost' || props.variant === 'outline') return 'secondary'
  return undefined // Primary is default
})
</script>
