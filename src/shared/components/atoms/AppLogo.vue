<template>
  <div class="app-logo-wrapper" :style="wrapperStyle">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="44" height="44" :rx="borderRadius" :fill="`url(#${gradientId})`" />
      <path
        d="M14 16C14 14.8954 14.8954 14 16 14H22C25.866 14 29 17.134 29 21C29 24.866 25.866 28 22 28H18V30C18 31.1046 17.1046 32 16 32C14.8954 32 14 31.1046 14 30V16Z"
        fill="white"
        fill-opacity="0.95"
      />
      <circle cx="30" cy="28" r="4" fill="white" fill-opacity="0.6" />
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="44" y2="44">
          <stop :stop-color="gradientStart" />
          <stop offset="1" :stop-color="gradientEnd" />
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
  gradientStart: '#8b5cf6', // Purple-600
  gradientEnd: '#6366f1',   // Indigo-500
  borderRadius: 12,
  withShadow: true
})

const gradientId = computed(() => `logo-gradient-${Math.random().toString(36).slice(2, 9)}`)

const wrapperStyle = computed(() => ({
  display: 'inline-flex',
  flexShrink: 0,
  filter: props.withShadow ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.12))' : 'none',
}))
</script>
