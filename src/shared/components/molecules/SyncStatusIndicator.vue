<template>
  <NTooltip trigger="hover" placement="bottom">
    <template #trigger>
      <div
        class="sync-status-indicator flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md shadow-[var(--shadow-sm)] transition-all duration-300 ease-out group cursor-default"
        :class="{ 'animate-pulse-subtle': status === 'syncing' || pendingCount > 0 }"
      >
        <!-- Simple Status Icon -->
        <div class="relative flex items-center justify-center w-5 h-5">
          <i
            :class="[statusInfo.icon, statusInfo.textClass]"
            class="text-[0.9rem] transition-all duration-150 ease-out"
          ></i>
        </div>

        <!-- Status Label (Hidden on small screens) -->
        <div class="hidden sm:flex items-center gap-1.5 overflow-hidden">
          <span
            class="text-[10px] font-bold tracking-tight uppercase opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            :class="statusInfo.textClass"
          >
            {{ statusInfo.label }}
          </span>
          <div
            v-if="pendingCount > 0"
            class="px-2 py-0.5 rounded-full bg-[#FF9500]/15 text-[#FF9500] text-[9px] font-black tracking-widest border border-[#FF9500]/20"
          >
            {{ pendingCount }}
          </div>
        </div>
      </div>
    </template>
    {{ tooltipContent }}
  </NTooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTooltip } from 'naive-ui'
import { useSyncStore } from '@/core/sync/syncStore'
import { storeToRefs } from 'pinia'

const store = useSyncStore()
const { status, isOnline, lastSyncTime, pendingCount } = storeToRefs(store)

const statusInfo = computed(() => {
  if (!isOnline.value) {
    return { label: 'Modo Offline', icon: 'i-lucide-wifi-off', textClass: 'text-muted' }
  }

  if (pendingCount.value > 0 && status.value !== 'syncing') {
    return { label: 'Pendente', icon: 'i-lucide-clock', textClass: 'text-warning-main dark:text-warning-main-dark' }
  }

  switch (status.value) {
    case 'syncing':
      return {
        label: 'Sincronizando',
        icon: 'i-lucide-refresh-cw animate-spin',
        textClass: 'text-info-main dark:text-info-main-dark',
      }
    case 'synced':
      return {
        label: 'Sincronizado',
        icon: 'i-lucide-check-circle',
        textClass: 'text-success-main dark:text-success-main-dark',
      }
    case 'pending':
      return { label: 'Aguardando Rede', icon: 'i-lucide-clock', textClass: 'text-warning-main dark:text-warning-main-dark' }
    default:
      return { label: 'Conectado', icon: 'i-lucide-check-circle', textClass: 'text-success-main dark:text-success-main-dark' }
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
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(0.985); }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}

.sync-status-indicator {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sync-status-indicator:hover {
  background-color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

:deep(.dark) .sync-status-indicator:hover {
  background-color: rgba(24, 24, 27, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
