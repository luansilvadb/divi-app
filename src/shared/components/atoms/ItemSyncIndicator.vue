<template>
  <div
    v-if="status !== 'synced'"
    class="item-sync-indicator flex items-center justify-center transition-all duration-300 hover:scale-110"
    :title="tooltipContent"
  >
    <!-- Pending (Pulsing Cloud) -->
    <svg
      v-if="status === 'pending'"
      data-test="sync-indicator-pending"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-orange-400 dark:text-orange-300 animate-pulse"
    >
      <path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-14 0 5.5 5.5 0 1 0 2.5 10.5" />
    </svg>

    <!-- Failed (Cloud with X) -->
    <svg
      v-else-if="status === 'failed'"
      data-test="sync-indicator-failed"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-red-500 animate-in fade-in zoom-in duration-300"
    >
      <path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-14 0 5.5 5.5 0 1 0 2.5 10.5" />
      <path d="m15 10-6 6" />
      <path d="m9 10 6 6" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status?: 'synced' | 'pending' | 'failed' | string
}>()

const tooltipContent = computed(() => {
  if (props.status === 'pending') return 'Sincronização pendente'
  if (props.status === 'failed') return 'Erro na sincronização'
  return ''
})
</script>

<style scoped>
.item-sync-indicator {
  display: inline-flex;
  vertical-align: middle;
}
</style>
