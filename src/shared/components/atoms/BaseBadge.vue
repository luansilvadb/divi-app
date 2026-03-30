<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border transition-colors',
      variantClasses[variant]
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary'

withDefaults(defineProps<{
  variant?: BadgeVariant
}>(), {
  variant: 'default'
})

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bg-main text-text-secondary border-border-main',
  primary: 'bg-primary-main/10 text-primary-main border-primary-main/20',
  success: 'bg-success-main/10 text-success-main border-success-main/20',
  error: 'bg-error-main/10 text-error-main border-error-main/20',
  warning: 'bg-warning-main/10 text-warning-main border-warning-main/20',
  info: 'bg-info-main/10 text-info-main border-info-main/20'
}
</script>

<style scoped>
/* Scoped styles removed */
</style>
