<script setup lang="ts">
interface Props {
  variant?: 'gradient' | 'solid' | 'noise'
  showNoise?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'gradient',
  showNoise: true,
})
</script>

<template>
  <div
    class="premium-background"
    :class="`premium-background--${variant}`"
  >
    <!-- Noise texture overlay -->
    <div
      v-if="showNoise"
      class="premium-background__noise"
      aria-hidden="true"
    />

    <!-- Gradient overlay for depth -->
    <div class="premium-background__gradient" aria-hidden="true" />

    <!-- Content slot -->
    <div class="premium-background__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.premium-background {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Base solid background */
.premium-background--solid {
  background: var(--color-bg-primary);
}

/* Gradient variant */
.premium-background--gradient {
  background: var(--gradient-bg-subtle);
}

/* Gradient overlay for depth */
.premium-background__gradient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(184, 115, 51, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(26, 26, 37, 0.5) 0%, transparent 70%);
  z-index: 0;
}

/* Noise texture */
.premium-background__noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Content wrapper */
.premium-background__content {
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

/* Reduced motion - simplify background */
@media (prefers-reduced-motion: reduce) {
  .premium-background__gradient {
    background: none;
  }
}
</style>
