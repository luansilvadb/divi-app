<template>
  <StandardPageLayout
    title="Log de Atividades"
    highlight="Atividades"
    subtitle="Histórico de operações e auditoria do sistema em tempo real."
  >
    <template #action>
      <NButton
        type="primary"
        round
        :loading="isRefreshing"
        @click="handleRefresh"
      >
        <template #icon>
          <i class="i-lucide-refresh-cw" :class="{ 'animate-spin': isRefreshing }"></i>
        </template>
        {{ isRefreshing ? 'Sincronizando...' : 'Atualizar' }}
      </NButton>
    </template>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      <!-- MAIN COLUMN: Timeline -->
      <main>
        <NCard>
          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <NSpin size="large" />
            <NText depth="3" class="text-xs uppercase tracking-widest mt-6">Carregando atividades...</NText>
          </div>

          <!-- Empty State -->
          <NEmpty
            v-else-if="activities.length === 0"
            description="Seu log de operações está vazio no momento."
            class="py-20"
          >
            <template #icon>
              <i class="i-lucide-list-todo text-5xl"></i>
            </template>
            <template #extra>
              <NText strong>Nenhuma atividade registrada</NText>
            </template>
          </NEmpty>

          <!-- Activity Timeline -->
          <NSpace v-else vertical :size="20">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="flex gap-4 relative group"
            >
              <!-- Status Icon -->
              <div
                class="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border"
                :class="[
                  `border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900`,
                ]"
              >
                <div
                  class="absolute inset-0 rounded-full opacity-10"
                  :class="statusBg(activity.type)"
                ></div>
                <i :class="statusIcon(activity.type)" class="text-sm" :style="{ color: statusColor(activity.type) }"></i>
              </div>

              <!-- Content -->
              <NCard embedded size="small" class="flex-1">
                <NSpace justify="space-between" align="start" class="mb-1">
                  <NText strong class="text-sm">{{ activity.action }}</NText>
                  <NTag size="tiny" round :bordered="false">
                    <template #icon><i class="i-lucide-clock text-[9px]"></i></template>
                    {{ formatDateTime(activity.timestamp) }}
                  </NTag>
                </NSpace>
                <NText depth="3" class="text-sm">{{ activity.description }}</NText>
              </NCard>
            </div>
          </NSpace>
        </NCard>
      </main>

      <!-- SIDEBAR COLUMN: Summary -->
      <aside class="side-column">
        <NCard>
          <template #header><NText strong>Auditoria de Segurança</NText></template>
          <NSpace vertical :size="16">
            <NText depth="3" class="text-xs leading-relaxed">
              O log de atividades é imutável e serve como registro histórico de todas as operações
              sensíveis realizadas na sua conta.
            </NText>
            <NCard embedded size="small" class="!border-[rgba(0,122,255,0.1)] !bg-[rgba(0,122,255,0.05)]">
              <NSpace align="start" :size="12">
                <i class="i-lucide-shield-check text-[#007AFF] text-lg shrink-0 mt-0.5"></i>
                <NText class="text-xs leading-relaxed">
                  Todas as ações são registradas com
                  <NText strong>timestamp</NText> e
                  <NText strong>contexto do usuário</NText>.
                </NText>
              </NSpace>
            </NCard>
          </NSpace>
        </NCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NButton,
  NCard,
  NSpace,
  NText,
  NTag,
  NEmpty,
  NSpin,
} from 'naive-ui'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IActivityLogService } from '../../core/ports/IActivityLogService'
import type { IActivity } from '../../core/entities/IActivity'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'

const activityService = container.resolve<IActivityLogService>(DI_TOKENS.IActivityLogService)
const activities = ref<IActivity[]>([])
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
    default: return 'bg-[#007AFF]'
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
