<template>
  <Button
    :severity="primeVariant"
    :outlined="variant === 'outline'"
    :text="variant === 'ghost'"
    :disabled="disabled || loading"
    :loading="loading"
    v-bind="$attrs"
    :class="[
      'rounded-full font-bold transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main active:scale-95',
      { 'shadow-lg': !['outline', 'ghost'].includes(variant) },
      // Custom overrides to keep the same specific brand colors overriding PrimeVue defaults if needed
      // (PrimeVue uses its own palette unless we map the surface/primary CSS vars)
      { 'bg-primary-main text-white shadow-primary-main/20': variant === 'primary' },
      { 'bg-secondary-main text-white shadow-secondary-main/20 border-secondary-main hover:bg-secondary-main/90': variant === 'secondary' },
      { 'bg-error-main text-white shadow-error-main/20 border-error-main hover:bg-error-main/90': variant === 'danger' },
      { 'border border-border-main text-text-primary hover:bg-surface-main': variant === 'outline' },
      { 'text-text-secondary hover:bg-surface-main': variant === 'ghost' },
    ]"
    :pt="{
        root: {
            class: ['px-6 py-2.5', { 'opacity-50 cursor-not-allowed active:scale-100': disabled || loading }]
        }
    }"
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

const primeVariant = computed(() => {
  if (props.variant === 'danger') return 'danger'
  if (props.variant === 'secondary') return 'secondary'
  return undefined // Primary is default
})
</script>
