<script setup lang="ts">
/**
 * AtmosphereBackground.vue
 * Implements a premium, performant mesh gradient background using CSS radial gradients.
 * Designed to provide a subtle, high-end feel without distracting from content.
 */
</script>

<template>
  <div class="atmosphere-bg" aria-hidden="true"></div>
</template>

<style scoped>
.atmosphere-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: var(--surface-background);
  background-image: 
    radial-gradient(at 0% 0%, var(--color-primary-subtle) 0%, transparent 50%),
    radial-gradient(at 50% 0%, var(--color-success-subtle) 0%, transparent 50%),
    radial-gradient(at 100% 0%, var(--color-info-subtle) 0%, transparent 50%);
  filter: blur(var(--atmosphere-blur));
  opacity: var(--atmosphere-opacity);
  pointer-events: none;
  transition: var(--theme-transition);
}
</style>
