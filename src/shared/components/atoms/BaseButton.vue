<template>
  <NButton
    :type="naiveType"
    :ghost="variant === 'outline' || variant === 'ghost'"
    :quaternary="variant === 'ghost'"
    :disabled="disabled || loading"
    :loading="loading"
    :size="size"
    v-bind="$attrs"
    class="apple-button"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <slot />
  </NButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-tinted'
type ButtonSize = 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
  },
)

const naiveType = computed(() => {
  if (props.variant === 'danger') return 'error'
  if (props.variant === 'primary') return 'primary'
  if (props.variant === 'secondary') return 'default' // Use default with custom styling
  return 'default'
})
</script>

<style scoped>
/* Apple-inspired button transitions */
.apple-button {
  transition:
    background-color 150ms cubic-bezier(0.25, 0.1, 0.25, 1),
    border-color 150ms cubic-bezier(0.25, 0.1, 0.25, 1),
    transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1),
    box-shadow 150ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Ensure focus-visible is properly handled */
.apple-button:focus-visible {
  outline: none;
}
</style>
