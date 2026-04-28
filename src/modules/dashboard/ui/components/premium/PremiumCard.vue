<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'

interface Props {
  variant?: 'default' | 'elevated' | 'glass'
  hoverable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glass',
  hoverable: true,
  clickable: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardRef = ref<HTMLElement>()

useMotion(cardRef, {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 500, ease: [0.16, 1, 0.3, 1] } },
})

const handleClick = (e: MouseEvent) => {
  if (props.clickable) {
    emit('click', e)
  }
}
</script>

<template>
  <div
    ref="cardRef"
    class="premium-card"
    :class="[
      `premium-card--${variant}`,
      { 'premium-card--hoverable': hoverable, 'premium-card--clickable': clickable }
    ]"
    @click="handleClick"
  >
    <div class="premium-card__shine" />
    <div class="premium-card__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.premium-card {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: transform var(--duration-normal) var(--ease-smooth),
              box-shadow var(--duration-normal) var(--ease-smooth);
}

/* Glass variant (default) */
.premium-card--glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--border-subtle);
  box-shadow: var(--shadow-md);
}

/* Elevated variant */
.premium-card--elevated {
  background: var(--color-bg-elevated);
  border: var(--border-subtle);
  box-shadow: var(--shadow-lg);
}

/* Default variant */
.premium-card--default {
  background: var(--color-bg-tertiary);
  border: var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

/* Hover effects */
.premium-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.premium-card--glass.premium-card--hoverable:hover {
  background: rgba(26, 26, 37, 0.9);
}

/* Clickable cursor */
.premium-card--clickable {
  cursor: pointer;
}

.premium-card--clickable:active {
  transform: scale(0.98);
}

/* Shine effect overlay */
.premium-card__shine {
  position: absolute;
  inset: 0;
  background: var(--gradient-card-shine);
  opacity: 0.5;
  pointer-events: none;
}

/* Content container */
.premium-card__content {
  position: relative;
  z-index: 1;
  padding: var(--space-6);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .premium-card {
    transition: none;
  }

  .premium-card--hoverable:hover {
    transform: none;
  }
}
</style>
