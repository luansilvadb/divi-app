<template>
  <StandardPageLayout
    title="Log de Atividades"
    highlight="Atividades"
    subtitle="Histórico de operações e auditoria do sistema em tempo real."
  >
    <template #action>
      <BaseButton variant="primary" @click="handleRefresh" :class="{ 'opacity-80': isRefreshing }">
        <template #icon><i class="i-lucide-refresh-cw" :class="{ 'animate-spin': isRefreshing }"></i></template>
        {{ isRefreshing ? 'Sincronizando...' : 'Atualizar' }}
      </BaseButton>
    </template>

    <div class="view-content-grid">
      <!-- MAIN COLUMN: Timeline -->
      <main class="main-column">
        <div class="glass-card p-10 min-h-[500px] overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem]">
          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center h-[400px] text-center"
          >
            <i class="i-lucide-loader-2 animate-spin text-4xl text-violet-500"></i>
            <p
              class="mt-8 text-[10px] font-black tracking-widest text-zinc-400 uppercase animate-pulse"
            >
              Carregando atividades...
            </p>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="activities.length === 0"
            class="flex flex-col items-center justify-center h-[400px] text-center px-6"
          >
            <div
              class="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-8 border border-zinc-200 dark:border-zinc-800 opacity-50"
            >
              <i class="i-lucide-list-todo text-4xl text-zinc-400"></i>
            </div>
            <h3
              class="text-2xl font-black text-zinc-800 dark:text-zinc-50 tracking-tight mb-2"
            >
              Nenhuma atividade registrada
            </h3>
            <p
              class="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-xs"
            >
              Seu log de operações está vazio no momento.
            </p>
          </div>

          <!-- Activity Timeline -->
          <div v-else class="activity-list flex flex-col gap-10 relative">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="activity-item flex gap-10 relative group"
            >
              <!-- Vertical Timeline Line -->
              <div
                class="absolute top-11 bottom-[-40px] left-5 w-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full z-0 group-last:hidden"
              ></div>

              <!-- Status Icon Area -->
              <div
                class="activity-icon-wrapper relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              >
                <div
                  class="absolute inset-0 rounded-full opacity-10"
                  :class="statusBg(activity.type)"
                ></div>
                <i :class="statusIcon(activity.type)" class="text-sm" :style="{ color: statusColor(activity.type) }"></i>
              </div>

              <!-- Content Block -->
              <div
                class="activity-content-box flex-1 flex flex-col gap-2 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300"
              >
                <div class="activity-header flex justify-between items-start gap-4">
                  <h3
                    class="action-title text-base font-black text-zinc-800 dark:text-zinc-50 tracking-tight"
                  >
                    {{ activity.action }}
                  </h3>
                  <div
                    class="timestamp-badge text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full"
                  >
                    <i class="i-lucide-clock text-[10px]"></i>
                    <span>{{ formatDateTime(activity.timestamp) }}</span>
                  </div>
                </div>
                <p
                  class="activity-description text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium opacity-80"
                >
                  {{ activity.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- SIDEBAR COLUMN: Summary -->
      <aside class="side-column">
        <BaseCard class="hover-glow">
          <template #header>Auditoria de Segurança</template>
          <div class="flex flex-col gap-6 pt-2">
            <p class="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              O log de atividades é imutável e serve como registro histórico de todas as operações
              sensíveis realizadas na sua conta.
            </p>
            <div
              class="bg-violet-500/5 p-4 rounded-2xl border border-violet-500/10 flex gap-4 items-start"
            >
              <div class="mt-0.5">
                <i class="i-lucide-shield-check text-violet-500 text-lg"></i>
              </div>
              <p class="text-[0.8rem] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Todas as ações são registradas com
                <strong class="text-zinc-800 dark:text-zinc-50">timestamp</strong> e
                <strong class="text-zinc-800 dark:text-zinc-50">contexto do usuário</strong>.
              </p>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IActivityLogService } from '../../domain/contracts/IActivityLogService'
import type { Activity } from '../../domain/entities/Activity'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'

const activityService = container.resolve<IActivityLogService>(DI_TOKENS.ActivityLogService)
const activities = ref<Activity[]>([])
const isLoading = ref(true)
const isRefreshing = ref(false)

const fetchActivities = async () => {
  try {
    activities.value = await activityService.getRecentActivities()
  } catch (error) {
    console.error('Failed to fetch activities:', error)
  }
}

const handleRefresh = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  await fetchActivities()
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}

onMounted(async () => {
  isLoading.value = true
  await fetchActivities()
  isLoading.value = false
})

const statusBg = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-500'
    case 'error': return 'bg-red-500'
    case 'warning': return 'bg-amber-500'
    default: return 'bg-violet-500'
  }
}

const statusIcon = (type: string) => {
  switch (type) {
    case 'success': return 'i-lucide-check'
    case 'error': return 'i-lucide-x'
    case 'warning': return 'i-lucide-alert-triangle'
    default: return 'i-lucide-info'
  }
}

const statusColor = (type: string) => {
  switch (type) {
    case 'success': return '#10b981'
    case 'error': return '#ef4444'
    case 'warning': return '#f59e0b'
    default: return '#8b5cf6'
  }
}

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const isToday = new Date().toDateString() === date.toDateString()
  const timeString = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  if (isToday) return `Hoje, ${timeString}`

  const dateString = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return `${dateString.toUpperCase()}, ${timeString}`
}
</script>
