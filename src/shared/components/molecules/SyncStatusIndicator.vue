<template>
  <NTooltip trigger="hover" placement="bottom">
    <template #trigger>
      <div
        class="sync-status-indicator flex items-center gap-2 px-3 py-1.5 rounded-full border border-separator bg-surface-primary/80 backdrop-blur-sm transition-all duration-150 ease-out group cursor-default"
      >
        <!-- Simple Status Icon -->
        <div class="relative flex items-center justify-center w-5 h-5">
          <i
            :class="statusInfo.icon"
            class="text-[0.9rem] transition-all duration-150 ease-out"
            :style="{ color: statusInfo.color }"
          ></i>
        </div>

        <!-- Status Label (Hidden on small screens) -->
        <div class="hidden sm:flex items-center gap-1.5 overflow-hidden">
          <span
            class="text-[10px] font-bold tracking-tight uppercase opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap text-secondary"
          >
            {{ statusInfo.label }}
          </span>
          <div
            v-if="pendingCount > 0"
            class="px-1.5 py-0.5 rounded-md bg-warning-subtle text-warning text-[10px] font-bold animate-pulse"
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
    return { label: 'Modo Offline', icon: 'i-lucide-wifi-off', color: 'var(--text-tertiary)' }
  }

  if (pendingCount.value > 0 && status.value !== 'syncing') {
    return { label: 'Pendente', icon: 'i-lucide-clock', color: 'var(--color-warning)' }
  }

  switch (status.value) {
    case 'syncing':
      return {
        label: 'Sincronizando',
        icon: 'i-lucide-refresh-cw animate-spin',
        color: 'var(--color-info)',
      }
    case 'synced':
      return {
        label: 'Sincronizado',
        icon: 'i-lucide-check-circle',
        color: 'var(--color-success)',
      }
    case 'pending':
      return { label: 'Aguardando Rede', icon: 'i-lucide-clock', color: 'var(--color-warning)' }
    default:
      return { label: 'Conectado', icon: 'i-lucide-check-circle', color: 'var(--color-success)' }
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
