<template>
  <NSkeleton
    :width="width"
    :height="height"
    :circle="rounded"
    :sharp="!rounded"
    class="!bg-zinc-200 dark:!bg-zinc-800"
    :class="customClass"
  />
</template>

<script setup lang="ts">
import { NSkeleton } from 'naive-ui'

withDefaults(
  defineProps<{
    width?: string | number
    height?: string | number
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
