<template>
  <div class="activity-log-view">
    <header class="view-header">
      <div class="title-section">
        <h1>Log de Atividades</h1>
        <p class="subtitle">Histórico de operações e auditoria do sistema</p>
      </div>
      <BaseButton variant="secondary" @click="fetchActivities">Atualizar</BaseButton>
    </header>

    <div class="view-content">
      <BaseCard>
        <div v-if="activities.length === 0" class="empty-state">
          <p>Nenhuma atividade registrada recentemente.</p>
        </div>
        
        <div v-else class="activity-list">
          <div v-for="activity in activities" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="activity.type">
              <span v-if="activity.type === 'success'">✅</span>
              <span v-else-if="activity.type === 'error'">❌</span>
              <span v-else-if="activity.type === 'warning'">⚠️</span>
              <span v-else>ℹ️</span>
            </div>
            <div class="activity-details">
              <div class="activity-header">
                <span class="action">{{ activity.action }}</span>
                <span class="timestamp">{{ formatDateTime(activity.timestamp) }}</span>
              </div>
              <p class="description">{{ activity.description }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { container } from '@/core/di'
import type { IActivityLogService, Activity } from '@/modules/finance/domain/services/IActivityLogService'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'

const activityService = container.resolve<IActivityLogService>('IActivityLogService')
const activities = ref<Activity[]>([])

const fetchActivities = async () => {
  activities.value = await activityService.getRecentActivities()
}

onMounted(fetchActivities)

const formatDateTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('pt-BR')
}
</script>

<style scoped>
.activity-log-view {
  max-width: 900px;
  margin: 0 auto;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.title-section h1 {
  margin: 0;
  font-size: 1.875rem;
}
.subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
}
.activity-list {
  display: flex;
  flex-direction: column;
}
.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}
.activity-item:last-child {
  border-bottom: none;
}
.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  flex-shrink: 0;
}
.activity-icon.success { background: #f0fdf4; }
.activity-icon.error { background: #fef2f2; }
.activity-icon.warning { background: #fffbeb; }

.activity-details {
  flex: 1;
}
.activity-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}
.action {
  font-weight: 600;
  color: #111827;
}
.timestamp {
  font-size: 0.75rem;
  color: #9ca3af;
}
.description {
  margin: 0;
  font-size: 0.875rem;
  color: #4b5563;
}
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}
</style>
