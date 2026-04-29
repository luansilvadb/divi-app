<template>
  <div class="app-logo-wrapper" :style="wrapperStyle">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      class="app-logo-svg"
    >
      <rect width="44" height="44" :rx="borderRadius" :fill="`url(#${gradientId})`" />
      <path
        d="M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z"
        fill="white"
        fill-opacity="0.98"
      />
      <circle cx="30" cy="28" r="4" fill="white" fill-opacity="0.7" />
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="44" y2="44">
          <stop :stop-color="gradientStartColor" />
          <stop offset="1" :stop-color="gradientEndColor" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number | string
  gradientStart?: string
  gradientEnd?: string
  borderRadius?: number
  withShadow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 44,
  gradientStart: 'var(--color-primary)',
  gradientEnd: 'var(--color-info)',
  borderRadius: 12,
  withShadow: true
})

const gradientId = computed(() => `logo-gradient-${Math.random().toString(36).slice(2, 9)}`)
const gradientStartColor = computed(() => props.gradientStart)
const gradientEndColor = computed(() => props.gradientEnd)

const wrapperStyle = computed(() => ({
  display: 'inline-flex',
  flexShrink: 0,
  filter: 'none',
}))
</script>

<style scoped>
.app-logo-svg {
  transition: transform 0.3s var(--ease-spring);
}

.app-logo-wrapper:hover .app-logo-svg {
  transform: rotate(-3deg) scale(1.05);
}
</style>
