<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonRef = ref<HTMLButtonElement>()

const createRipple = (e: MouseEvent) => {
  if (!buttonRef.value || props.disabled) return

  const button = buttonRef.value
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.className = 'ripple-effect'
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
  `

  button.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
}

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) return
  createRipple(e)
  emit('click', e)
}
</script>

<template>
  <button
    ref="buttonRef"
    class="premium-button"
    :class="[
      `premium-button--${variant}`,
      `premium-button--${size}`,
      { 'premium-button--disabled': disabled, 'premium-button--loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="premium-button__spinner" />
    <span class="premium-button__content" :class="{ 'premium-button__content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped>
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.premium-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-smooth);
  outline: none;
}

/* Size variants */
.premium-button--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.premium-button--md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
}

.premium-button--lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}

/* Primary variant - Gold gradient */
.premium-button--primary {
  background: var(--gradient-accent-gold);
  color: var(--color-bg-primary);
  box-shadow: var(--shadow-gold);
}

.premium-button--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
}

.premium-button--primary:active:not(:disabled) {
  transform: scale(0.98);
}

.premium-button--primary:focus-visible {
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3), var(--shadow-gold);
}

/* Secondary variant */
.premium-button--secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: var(--border-subtle);
}

.premium-button--secondary:hover:not(:disabled) {
  background: var(--color-bg-elevated);
  border-color: rgba(255, 255, 255, 0.12);
}

.premium-button--secondary:focus-visible {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

/* Ghost variant */
.premium-button--ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.premium-button--ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.premium-button--ghost:focus-visible {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

/* Disabled state */
.premium-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading state */
.premium-button--loading {
  cursor: wait;
}

.premium-button__spinner {
  position: absolute;
  width: 1.25em;
  height: 1.25em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.premium-button__content--hidden {
  opacity: 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .premium-button,
  .premium-button__spinner {
    transition: none;
    animation: none;
  }
}
</style>
