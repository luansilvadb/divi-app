<template>
  <StandardPageLayout
    title="Log de Atividades"
    highlight="Atividades"
    subtitle="Histórico de operações e auditoria do sistema em tempo real."
  >
    <template #action>
      <BaseButton variant="primary" @click="handleRefresh" :class="{ 'opacity-80': isRefreshing }">
        {{ isRefreshing ? 'Sincronizando...' : 'Atualizar' }}
      </BaseButton>
    </template>

    <!-- Content Area (Unified Layout) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN: Timeline -->
      <main class="main-column">
        <div class="glass-card p-10 min-h-[500px] overflow-hidden">
          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center h-[400px] text-center"
          >
            <div
              class="w-12 h-12 border-4 border-primary-main/10 border-t-primary-main rounded-full animate-spin"
            ></div>
            <p
              class="mt-8 text-[10px] font-black tracking-widest text-text-disabled uppercase animate-pulse"
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
              class="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-8 border border-black/5 dark:border-white/5 opacity-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-10 h-10"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 class="text-2xl font-black text-text-primary tracking-tight mb-2">
              Nenhuma atividade registrada
            </h3>
            <p class="text-sm text-text-secondary font-medium leading-relaxed max-w-xs">
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
                class="absolute top-11 bottom-[-40px] left-5 w-0.5 bg-black/5 dark:bg-white/5 rounded-full z-0 group-last:hidden"
              ></div>

              <!-- Status Icon Area -->
              <div
                class="activity-icon-wrapper relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm border border-black/5 dark:border-white/5"
              >
                <div
                  class="absolute inset-0 rounded-full opacity-10"
                  :class="statusBg(activity.type)"
                ></div>
                <svg
                  v-if="activity.type === 'success'"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 text-success-main"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <svg
                  v-else-if="activity.type === 'error'"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 text-error-main"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <svg
                  v-else-if="activity.type === 'warning'"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 text-warning-main"
                >
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 text-primary-main"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>

              <!-- Content Block -->
              <div
                class="activity-content-box flex-1 flex flex-col gap-2 p-5 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-white/40 dark:hover:bg-black/20 transition-all duration-300"
              >
                <div class="activity-header flex justify-between items-start gap-4">
                  <h3 class="action-title text-base font-black text-text-primary tracking-tight">
                    {{ activity.action }}
                  </h3>
                  <div
                    class="timestamp-badge text-[10px] font-black uppercase tracking-widest text-text-disabled flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-full"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-3 h-3"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{{ formatDateTime(activity.timestamp) }}</span>
                  </div>
                </div>
                <p
                  class="activity-description text-sm text-text-secondary leading-relaxed font-medium opacity-80"
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
        <BaseCard>
          <template #header>Auditoria de Segurança</template>
          <div class="flex flex-col gap-6 pt-2">
            <p class="text-xs text-text-secondary font-medium leading-relaxed">
              O log de atividades é imutável e serve como registro histórico de todas as operações
              sensíveis realizadas na sua conta.
            </p>
            <div
              class="bg-primary-main/5 p-4 rounded-2xl border border-primary-main/10 flex gap-4 items-start"
            >
              <div class="mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-primary-main"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <p class="text-[0.8rem] text-text-secondary leading-relaxed">
                Todas as ações são registradas com
                <strong class="text-text-primary">timestamp</strong> e
                <strong class="text-text-primary">contexto do usuário</strong>.
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

// Component State
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
    case 'success':
      return 'bg-success-main'
    case 'error':
      return 'bg-error-main'
    case 'warning':
      return 'bg-warning-main'
    case 'info':
      return 'bg-primary-main'
    default:
      return 'bg-primary-main'
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
