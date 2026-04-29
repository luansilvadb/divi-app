<template>
  <div
    v-if="status !== 'synced'"
    class="item-sync-indicator flex items-center justify-center transition-all duration-150 ease-out hover:scale-110"
    :title="tooltipContent"
  >
    <!-- Pending (Pulsing Cloud with Aura) -->
    <div v-if="status === 'pending'" class="relative flex items-center justify-center">
      <div class="absolute inset-0 bg-orange-400/20 blur-md rounded-full animate-pulse-slow"></div>
      <svg
        data-test="sync-indicator-pending"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-orange-500 dark:text-orange-400 relative z-10 animate-breathe"
      >
        <path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-14 0 5.5 5.5 0 1 0 2.5 10.5" />
      </svg>
    </div>

    <!-- Failed (Cloud with X and Red Aura) -->
    <div v-else-if="status === 'failed'" class="relative flex items-center justify-center">
      <div class="absolute inset-0 bg-red-500/10 blur-md rounded-full animate-pulse-fast"></div>
      <svg
        data-test="sync-indicator-failed"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-red-500 relative z-10 animate-in fade-in zoom-in duration-300"
      >
        <path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-14 0 5.5 5.5 0 1 0 2.5 10.5" />
        <path d="m15 10-6 6" />
        <path d="m9 10 6 6" />
      </svg>
    </div>
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

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.92); opacity: 0.8; }
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.5); opacity: 0.1; }
}

@keyframes pulse-fast {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.3); opacity: 0.1; }
}

.animate-breathe {
  animation: breathe 2.5s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-pulse-fast {
  animation: pulse-fast 1.5s ease-in-out infinite;
}
</style>
