<template>
  <button
    :class="[
      'px-6 py-2.5 rounded-full font-bold transition-all duration-300 outline-none active:scale-95',
      variantClasses[variant],
      { 'opacity-50 cursor-not-allowed active:scale-100': disabled || loading },
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="mr-2">...</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

const props = defineProps<{
  variant?: ButtonVariant
  disabled?: boolean
  loading?: boolean
}>()

const variant = props.variant || 'primary'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-main text-white hover:opacity-90 shadow-lg shadow-primary-main/20',
  secondary:
    'bg-secondary-main text-white hover:opacity-90 shadow-lg shadow-secondary-main/20',
  outline:
    'border border-border-main bg-transparent text-text-primary hover:bg-surface-main',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-main',
  danger:
    'bg-error-main text-white hover:opacity-90 shadow-lg shadow-error-main/20',
}
</script>
