<template>
  <Skeleton
    :width="width"
    :height="height"
    :borderRadius="rounded ? '50%' : '8px'"
    class="relative overflow-hidden bg-black/5 dark:bg-white/5 animate-pulse"
    :class="customClass"
  >
    <div class="absolute inset-0 animate-shimmer"></div>
  </Skeleton>
</template>

<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

withDefaults(
  defineProps<{
    width?: string
    height?: string
    rounded?: boolean
    customClass?: string
  }>(),
  {
    width: '100%',
    height: '20px',
    rounded: false,
  },
)
</script>
