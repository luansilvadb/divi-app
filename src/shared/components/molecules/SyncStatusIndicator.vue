<template>
  <div 
    class="sync-status-indicator flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-sm transition-all duration-300 group cursor-default"
    :class="{
      'hover:bg-white/80 dark:hover:bg-white/10': true,
      'border-error-main/20 bg-error-main/5': fatalErrorCount > 0
    }"
    v-tooltip.bottom="tooltipContent"
  >
    <!-- Status Icon -->
    <div class="relative flex items-center justify-center w-5 h-5">
      <i 
        :class="statusInfo.icon" 
        class="text-[0.9rem] transition-all duration-500"
        :style="{ color: statusInfo.color }"
      ></i>
      
      <!-- Pulsing Dot for activity -->
      <span 
        v-if="status === 'syncing'"
        class="absolute inset-0 rounded-full animate-ping opacity-25"
        :style="{ backgroundColor: statusInfo.color }"
      ></span>
    </div>

    <!-- Status Label -->
    <span class="text-[0.7rem] font-bold tracking-tight uppercase opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {{ statusInfo.label }}
    </span>

    <!-- Pending Count Badge -->
    <div 
      v-if="pendingCount > 0 && fatalErrorCount === 0"
      class="flex items-center justify-center min-w-[1.2rem] h-[1.2rem] px-1 rounded-md bg-warning-main/20 text-warning-main text-[0.6rem] font-black"
    >
      {{ pendingCount }}
    </div>

    <!-- Fatal Error Badge -->
    <div 
      v-if="fatalErrorCount > 0"
      class="flex items-center justify-center min-w-[1.2rem] h-[1.2rem] px-1 rounded-md bg-error-main/20 text-error-main text-[0.6rem] font-black"
    >
      {{ fatalErrorCount }}!
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSyncStore } from '@/core/sync/syncStore'
import { storeToRefs } from 'pinia'

const store = useSyncStore()
const { status, pendingCount, fatalErrorCount, isOnline, lastSyncTime, error } = storeToRefs(store)

const statusInfo = computed(() => {
  if (fatalErrorCount.value > 0) {
    return { label: 'Ação Necessária', icon: 'pi pi-exclamation-triangle', color: 'var(--color-error-main)' }
  }

  if (!isOnline.value) {
    return { label: 'Modo Offline', icon: 'pi pi-wifi-slash', color: 'var(--color-text-disabled)' }
  }

  switch (status.value) {
    case 'syncing':
      return { label: 'Sincronizando', icon: 'pi pi-sync pi-spin', color: 'var(--color-primary-main)' }
    case 'synced':
      return { label: 'Sincronizado', icon: 'pi pi-check-circle', color: 'var(--color-success-main)' }
    case 'pending':
      return { label: 'Pendente', icon: 'pi pi-clock', color: 'var(--color-warning-main)' }
    case 'failed':
      return { label: 'Falha de Rede', icon: 'pi pi-wifi-slash', color: 'var(--color-error-main)' }
    default:
      return { label: 'Online', icon: 'pi pi-check-circle', color: 'var(--color-success-main)' }
  }
})

const tooltipContent = computed(() => {
  if (fatalErrorCount.value > 0) {
    return `${fatalErrorCount.value} erros críticos detectados. Verifique os logs no perfil.`
  }
  
  if (!isOnline.value) {
    return `Você está offline. ${pendingCount.value} alterações serão sincronizadas assim que a rede voltar.`
  }

  if (status.value === 'syncing') return 'Enviando alterações para a nuvem...'
  
  if (lastSyncTime.value) {
    const date = new Date(lastSyncTime.value)
    return `Última sincronização: ${date.toLocaleTimeString()}`
  }

  if (pendingCount.value > 0) return `${pendingCount.value} alterações aguardando envio`
  
  return statusInfo.value.label
})
</script>

<style scoped>
.sync-status-indicator {
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05);
}
</style>
