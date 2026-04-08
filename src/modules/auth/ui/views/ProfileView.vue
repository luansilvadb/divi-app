<script setup lang="ts">
import { computed } from 'vue'
import { useSyncStore } from '../../../../core/sync/syncStore'
import { useAuthStore } from '../../application/authStore'
import syncEngine from '../../../../core/sync/SyncEngine'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'

const syncStore = useSyncStore()
const authStore = useAuthStore()

const logs = computed(() => syncStore.logs)

const isSyncing = computed(() => syncStore.status === 'syncing')

const handleManualSync = async () => {
  await syncEngine.sync()
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'success': return 'success'
    case 'failed': return 'danger'
    case 'pending': return 'warning'
    default: return 'info'
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('pt-BR')
}

const clearLogs = () => {
  syncStore.clearLogs()
}
</script>

<template>
  <div class="profile-page p-6 max-w-5xl mx-auto">
    <header class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-black text-text-primary tracking-tight mb-2">Meu Perfil</h1>
        <p class="text-text-secondary opacity-60">Gerencie sua conta e visualize o status de sincronização.</p>
      </div>
      <div class="flex gap-3">
        <Button 
          label="Forçar Sincronização" 
          :icon="isSyncing ? 'pi pi-spin pi-spinner' : 'pi pi-sync'" 
          :loading="isSyncing"
          severity="primary" 
          size="small"
          class="rounded-full px-6"
          @click="handleManualSync"
        />
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- User Info Card -->
      <Card class="lg:col-span-1 overflow-hidden border-none shadow-xl bg-surface-main/50 backdrop-blur-md">
        <template #content>
          <div class="flex flex-col items-center text-center py-6">
            <div class="w-24 h-24 rounded-full bg-primary-main/20 flex items-center justify-center mb-4 border-4 border-primary-main/10">
              <span class="text-3xl font-black text-primary-main">LS</span>
            </div>
            <h2 class="text-xl font-bold text-text-primary">{{ authStore.user?.email?.split('@')[0] || 'Usuário' }}</h2>
            <p class="text-sm text-text-secondary opacity-60 mb-6">{{ authStore.user?.email }}</p>
            
            <div class="w-full flex flex-col gap-3 px-4">
              <div class="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5">
                <span class="text-xs font-bold uppercase tracking-wider opacity-40">Status Sync</span>
                <Tag :value="syncStore.status" :severity="getStatusSeverity(syncStore.status === 'synced' ? 'success' : syncStore.status === 'failed' ? 'failed' : 'pending')" />
              </div>
              <div class="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5">
                <span class="text-xs font-bold uppercase tracking-wider opacity-40">Última Sinc.</span>
                <span class="text-xs font-mono">{{ syncStore.lastSyncTime ? formatDate(syncStore.lastSyncTime) : 'Nunca' }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Sync Logs Card -->
      <Card class="lg:col-span-2 border-none shadow-xl bg-surface-main/50 backdrop-blur-md">
        <template #title>
          <div class="flex justify-between items-center px-2">
            <span class="text-xl font-bold">Logs de Sincronização</span>
            <Button 
              icon="pi pi-trash" 
              text 
              rounded 
              severity="danger" 
              size="small" 
              v-tooltip.top="'Limpar Histórico'"
              @click="clearLogs"
            />
          </div>
        </template>
        <template #content>
          <DataTable :value="logs" :rows="10" paginator class="p-datatable-sm" emptyMessage="Nenhum log registrado.">
            <Column field="timestamp" header="Hora" style="width: 25%">
              <template #body="slotProps">
                <span class="text-xs opacity-60 font-mono">{{ formatDate(slotProps.data.timestamp) }}</span>
              </template>
            </Column>
            <Column field="status" header="Status" style="width: 15%">
              <template #body="slotProps">
                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
              </template>
            </Column>
            <Column field="message" header="Mensagem">
              <template #body="slotProps">
                <span class="text-sm font-medium">{{ slotProps.data.message }}</span>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.profile-page :deep(.p-card-body) {
  padding: 1.5rem;
}

.profile-page :deep(.p-datatable-header) {
  background: transparent;
  border: none;
}

.profile-page :deep(.p-datatable .p-datatable-thead > tr > th) {
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 800;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

:is(.dark) .profile-page :deep(.p-datatable .p-datatable-thead > tr > th) {
  border-bottom-color: rgba(255,255,255,0.05);
}

.profile-page :deep(.p-datatable .p-datatable-tbody > tr) {
  background: transparent;
}
</style>
