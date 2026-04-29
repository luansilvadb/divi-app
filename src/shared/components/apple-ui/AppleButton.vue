<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => {
  return [
    'apple-button',
    `apple-button--${props.variant}`,
    `apple-button--${props.size}`,
    {
      'apple-button--disabled': props.disabled
    }
  ]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    :type="type"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.apple-button {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease, background-color 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.apple-button:hover:not(.apple-button--disabled) {
  transform: scale(1.015);
  filter: brightness(1.08);
}

.apple-button:active:not(.apple-button--disabled) {
  transform: scale(0.975);
  filter: brightness(0.95);
}

.apple-button--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Variant: Primary */
.apple-button--primary {
  background-color: var(--color-primary);
  color: #ffffff;
  border-radius: 9px;
  box-shadow: 0 1px 3px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

/* Variant: Secondary */
.apple-button--secondary {
  background-color: var(--surface-secondary);
  color: var(--text-label);
  border-radius: 9px;
  border: 1px solid var(--surface-separator);
}

/* Variant: Ghost */
.apple-button--ghost {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--surface-separator);
  border-radius: 9px;
}

.apple-button--ghost:hover:not(.apple-button--disabled) {
  background-color: var(--color-primary-subtle);
  border-color: var(--color-primary);
  filter: none;
}

/* Size: Small */
.apple-button--small {
  padding: 5px 12px;
  font-size: 13px;
}

/* Size: Medium */
.apple-button--medium {
  padding: 8px 16px;
  font-size: 15px;
}

/* Size: Large */
.apple-button--large {
  padding: 12px 24px;
  font-size: 17px;
}

/* Focus state */
.apple-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
