<template>
  <Skeleton
    :width="width"
    :height="height"
    :borderRadius="rounded ? '50%' : '8px'"
    class="relative overflow-hidden bg-surface-50 dark:bg-surface-800/10"
    :class="customClass"
  >

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


