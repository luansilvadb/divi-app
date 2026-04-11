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
      'font-bold rounded-xl transition-all duration-apple-fast ease-apple outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-main active:scale-95 px-6 py-2.5',
      { 'apple-button-filled': variant === 'primary' },
      { 'apple-button-tinted': variant === 'secondary' },
      { 'apple-button-danger-filled': variant === 'danger' },
      { 'apple-button-danger-tinted': variant === 'danger-tinted' },
    ]"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-tinted'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    disabled: false,
    loading: false,
  },
)

const primeSeverity = computed(() => {
  if (props.variant === 'danger' || props.variant === 'danger-tinted') return 'danger'
  if (props.variant === 'secondary') return 'secondary'
  if (props.variant === 'ghost' || props.variant === 'outline') return 'secondary'
  return undefined // Primary is default
})
</script>
