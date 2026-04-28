<template>
  <div
    ref="cardRef"
    class="ripple-card"
    :class="{ 'ripple-card--active': isActive }"
    @click="handleClick"
  >
    <!-- Side Color Bar -->
    <div
      v-if="color"
      class="ripple-card__color-bar"
      :style="{ backgroundColor: color }"
    ></div>

    <!-- Ripple Effect Container -->
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="ripple-card__ripple"
      :style="{
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        width: `${ripple.size}px`,
        height: `${ripple.size}px`,
      }"
    ></span>

    <!-- Content Slot -->
    <div class="ripple-card__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  color?: string
}

defineProps<Props>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardRef = ref<HTMLDivElement>()
const ripples = ref<Array<{ id: number; x: number; y: number; size: number }>>([])
const isActive = ref(false)
let rippleId = 0

const handleClick = (e: MouseEvent) => {
  if (!cardRef.value) return

  const rect = cardRef.value.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const newRipple = {
    id: rippleId++,
    x,
    y,
    size,
  }

  ripples.value.push(newRipple)

  // Active state for tactile feedback
  isActive.value = true
  setTimeout(() => {
    isActive.value = false
  }, 150)

  // Remove ripple after animation
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== newRipple.id)
  }, 600)

  emit('click', e)
}
</script>

<style scoped>
@keyframes ripple-animation {
  to {
    transform: scale(1);
    opacity: 0;
  }
}

.ripple-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 16px;
  background-color: #ffffff;
  transition:
    background-color 150ms cubic-bezier(0.25, 0.1, 0.25, 1),
    transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.dark .ripple-card {
  background-color: #1c1c1e;
}

.ripple-card:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.dark .ripple-card:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.ripple-card:active,
.ripple-card--active {
  transform: scale(0.98);
}

.ripple-card__color-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  border-radius: 16px 0 0 16px;
}

.ripple-card__ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(0, 113, 227, 0.15);
  transform: scale(0);
  animation: ripple-animation 600ms cubic-bezier(0.25, 0.1, 0.25, 1);
  pointer-events: none;
}

.ripple-card__content {
  position: relative;
  z-index: 1;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ripple-card,
  .ripple-card__ripple {
    transition: none;
    animation: none;
  }
}
</style>
