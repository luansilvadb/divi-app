<template>
  <div 
    class="sync-status-indicator flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-sm transition-all duration-300 group cursor-default"
    v-tooltip.bottom="tooltipContent"
  >
    <!-- Simple Status Icon -->
    <div class="relative flex items-center justify-center w-5 h-5">
      <i 
        :class="statusInfo.icon" 
        class="text-[0.9rem] transition-all duration-500"
        :style="{ color: statusInfo.color }"
      ></i>
    </div>

    <!-- Status Label (Hidden on small screens) -->
    <div class="hidden sm:flex items-center gap-1.5 overflow-hidden">
      <span class="text-[0.7rem] font-bold tracking-tight uppercase opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {{ statusInfo.label }}
      </span>
      <div 
        v-if="pendingCount > 0" 
        class="px-1.5 py-0.5 rounded-md bg-warning-main/10 text-warning-main text-[0.6rem] font-black animate-pulse"
      >
        {{ pendingCount }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSyncStore } from '@/core/sync/syncStore'
import { storeToRefs } from 'pinia'

const store = useSyncStore()
const { status, isOnline, lastSyncTime, pendingCount } = storeToRefs(store)

const statusInfo = computed(() => {
  if (!isOnline.value) {
    return { label: 'Modo Offline', icon: 'pi pi-wifi-slash', color: 'var(--color-text-disabled)' }
  }

  if (pendingCount.value > 0 && status.value !== 'syncing') {
    return { label: 'Pendente', icon: 'pi pi-clock', color: 'var(--color-warning-main)' }
  }

  switch (status.value) {
    case 'syncing':
      return { label: 'Sincronizando', icon: 'pi pi-sync pi-spin', color: 'var(--color-primary-main)' }
    case 'synced':
      return { label: 'Sincronizado', icon: 'pi pi-check-circle', color: 'var(--color-success-main)' }
    case 'pending':
      return { label: 'Aguardando Rede', icon: 'pi pi-clock', color: 'var(--color-warning-main)' }
    default:
      return { label: 'Conectado', icon: 'pi pi-check-circle', color: 'var(--color-success-main)' }
  }
})

const tooltipContent = computed(() => {
  if (!isOnline.value) {
    return `Você está offline. Alterações serão salvas localmente.`
  }

  if (status.value === 'syncing') return 'Trabalhando na nuvem...'
  
  if (lastSyncTime.value) {
    const date = new Date(lastSyncTime.value)
    return `Última sincronização: ${date.toLocaleTimeString()}`
  }

  return statusInfo.value.label
})
</script>

<style scoped>
.sync-status-indicator {
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05);
}
</style>
