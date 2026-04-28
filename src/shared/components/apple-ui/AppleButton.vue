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
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.apple-button:hover:not(.apple-button--disabled) {
  transform: scale(1.02);
  opacity: 0.9;
}

.apple-button:active:not(.apple-button--disabled) {
  transform: scale(0.98);
}

.apple-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variant: Primary */
.apple-button--primary {
  background-color: #0071e3;
  color: #ffffff;
  border-radius: 8px;
}

.apple-button--primary:hover:not(.apple-button--disabled) {
  background-color: #0077ed;
}

/* Variant: Secondary */
.apple-button--secondary {
  background-color: #1d1d1f;
  color: #ffffff;
  border-radius: 8px;
}

.apple-button--secondary:hover:not(.apple-button--disabled) {
  background-color: #2d2d2f;
}

/* Variant: Ghost */
.apple-button--ghost {
  background-color: transparent;
  color: #0071e3;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
}

.apple-button--ghost:hover:not(.apple-button--disabled) {
  background-color: rgba(0, 113, 227, 0.05);
  border-color: #0071e3;
}

/* Size: Small */
.apple-button--small {
  padding: 6px 12px;
  font-size: 14px;
}

/* Size: Medium */
.apple-button--medium {
  padding: 8px 15px;
  font-size: 17px;
}

/* Size: Large */
.apple-button--large {
  padding: 12px 24px;
  font-size: 17px;
}

/* Focus state for accessibility */
.apple-button:focus-visible {
  outline: 2px solid #0071e3;
  outline-offset: 2px;
}
</style>
