<template>
  <Button
    :severity="primeSeverity"
    :outlined="variant === 'outline'"
    :text="variant === 'ghost'"
    :disabled="disabled || loading"
    :loading="loading"
    v-bind="$attrs"
    :class="[
      'rounded-full font-bold transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main active:scale-95 px-6 py-2.5',
      { 'shadow-lg': !['outline', 'ghost'].includes(variant) },
      // Custom overrides to keep the same specific brand colors
      { 'bg-primary-main text-white shadow-primary-main/20 border-primary-main': variant === 'primary' },
      { 'bg-secondary-main text-white shadow-secondary-main/20 border-secondary-main hover:bg-secondary-main/90': variant === 'secondary' },
      { 'bg-error-main text-white shadow-error-main/20 border-error-main hover:bg-error-main/90': variant === 'danger' },
      { 'border border-border-main text-text-primary hover:bg-surface-main': variant === 'outline' },
      { 'text-text-secondary hover:bg-surface-main': variant === 'ghost' },
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
