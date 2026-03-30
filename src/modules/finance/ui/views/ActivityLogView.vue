<template>
  <div class="activity-log-view animate-fade-in">
    <!-- Animated background orbs -->
    <div class="view-bg-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    
    <!-- Noise texture overlay -->
    <div class="noise-overlay" aria-hidden="true"></div>

    <div class="view-container">
      <header class="view-header">
        <div class="title-section">
          <div class="title-icon-wrapper">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="title-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
          </div>
          <div>
            <h1 class="page-title">
              Log de <span class="text-accent-main">Atividades</span>
            </h1>
            <p class="page-subtitle">Histórico de operações e auditoria do sistema em tempo real</p>
          </div>
        </div>
        <button class="refresh-btn" @click="handleRefresh" :class="{ 'is-refreshing': isRefreshing }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="refresh-icon"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.44l5.66 5.66"/></svg>
          <span>Atualizar</span>
        </button>
      </header>

      <div class="view-content">
        <div class="glass-container">
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-state">
             <div class="spinner"></div>
             <p>Carregando atividades...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="activities.length === 0" class="empty-state animate-enter">
            <div class="empty-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3>Nenhuma atividade por aqui</h3>
            <p>Seu log de operações está vazio no momento.</p>
          </div>
          
          <!-- Activity List -->
          <div v-else class="activity-list">
            <div 
              v-for="(activity, index) in activities" 
              :key="activity.id" 
              class="activity-item animate-enter"
              :style="{ '--enter-delay': `${index * 50}ms` }"
            >
              <div class="activity-timeline-line" v-if="index !== activities.length - 1"></div>
              
              <div class="activity-icon-wrapper" :class="activity.type">
                <div class="activity-icon-bg"></div>
                <!-- Success icon -->
                <svg v-if="activity.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><path d="M20 6L9 17l-5-5"/></svg>
                <!-- Error icon -->
                <svg v-else-if="activity.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <!-- Warning icon -->
                <svg v-else-if="activity.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <!-- Info/Default icon -->
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              
              <div class="activity-content-box glass-card hover-glow">
                <div class="activity-header">
                  <h3 class="action-title">{{ activity.action }}</h3>
                  <div class="timestamp-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>{{ formatDateTime(activity.timestamp) }}</span>
                  </div>
                </div>
                <p class="activity-description">{{ activity.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { container } from '@/core/di'
import type { IActivityLogService, Activity } from '@/modules/finance/domain/services/IActivityLogService'

// Component State
const activityService = container.resolve<IActivityLogService>('IActivityLogService')
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
  // Add slight delay for animation effect
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}

onMounted(async () => {
  isLoading.value = true
  await fetchActivities()
  isLoading.value = false
})

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const isToday = new Date().toDateString() === date.toDateString()
  
  const timeString = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  
  if (isToday) {
    return `Hoje, ${timeString}`
  }
  
  const dateString = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return `${dateString}, ${timeString}`
}
</script>

<style scoped>
/* ===== Page Layout ===== */
.activity-log-view {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 2rem 2.5rem;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 1;
}

/* ===== Background Effects ===== */
.view-bg-orbs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: -2;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
  will-change: transform;
}

:is(.dark) .orb {
  opacity: 0.15;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: var(--color-primary-main);
  top: -10%;
  right: -10%;
  animation: float-1 20s ease-in-out infinite;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: var(--color-secondary-main);
  bottom: -20%;
  left: -5%;
  animation: float-2 25s ease-in-out infinite;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: var(--color-accent-main);
  top: 40%;
  left: 30%;
  animation: float-3 22s ease-in-out infinite;
  opacity: 0.1;
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.05); }
  66% { transform: translate(20px, -40px) scale(0.95); }
}

@keyframes float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.9); }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, 20px) scale(1.1); }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
}

/* ===== View Container & Header ===== */
.view-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.title-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  color: white;
  box-shadow: 0 8px 16px rgba(var(--color-primary-main-rgb), 0.2);
}

.title-icon {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
  line-height: 1.1;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.05rem;
  margin: 0;
}

/* ===== Refresh Button ===== */
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

:is(.dark) .refresh-btn {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.9);
}

:is(.dark) .refresh-btn:hover {
  background: rgba(40, 54, 76, 0.7);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.refresh-btn:active {
  transform: translateY(0);
}

.refresh-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.5s ease;
}

.refresh-btn.is-refreshing .refresh-icon {
  animation: spin 1s linear infinite;
}

/* ===== Main Container (Glass) ===== */
.glass-container {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  box-shadow:
    0 4px 24px -8px rgba(0, 0, 0, 0.06),
    0 12px 48px -12px rgba(0, 0, 0, 0.04);
  padding: 2.5rem;
  min-height: 400px;
}

:is(.dark) .glass-container {
  background: rgba(22, 27, 34, 0.5);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 24px -8px rgba(0, 0, 0, 0.3),
    0 12px 48px -12px rgba(0, 0, 0, 0.2);
}

/* ===== Loading State ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 1.5rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(var(--color-primary-main-rgb), 0.2);
  border-top-color: var(--color-primary-main);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(var(--color-primary-main-rgb), 0.05);
  color: var(--color-primary-main);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(var(--color-primary-main-rgb), 0.1);
}

.empty-icon-wrapper svg {
  width: 40px;
  height: 40px;
  opacity: 0.8;
}

:is(.dark) .empty-icon-wrapper {
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-secondary);
  border-color: rgba(255, 255, 255, 0.05);
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 0.95rem;
}

/* ===== Activity Timeline ===== */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
}

.activity-item {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

.activity-timeline-line {
  position: absolute;
  top: 50px;
  bottom: -1.5rem;
  left: 21px; /* Center of icon (44px/2 - 1px width) */
  width: 2px;
  background: linear-gradient(to bottom, var(--color-border-main), rgba(0,0,0,0.02));
  z-index: 0;
}

:is(.dark) .activity-timeline-line {
  background: linear-gradient(to bottom, var(--color-border-main), rgba(255,255,255,0.02));
}

.activity-icon-wrapper {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.activity-icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.15;
  transition: opacity 0.3s ease;
}

.status-icon {
  width: 20px;
  height: 20px;
  position: relative;
  z-index: 1;
}

/* Status variants */
.activity-icon-wrapper.success .activity-icon-bg { background: var(--color-success-main); }
.activity-icon-wrapper.success .status-icon { color: var(--color-success-main); }

.activity-icon-wrapper.error .activity-icon-bg { background: var(--color-error-main); }
.activity-icon-wrapper.error .status-icon { color: var(--color-error-main); }

.activity-icon-wrapper.warning .activity-icon-bg { background: var(--color-warning-main); }
.activity-icon-wrapper.warning .status-icon { color: var(--color-warning-main); }

.activity-icon-wrapper.info .activity-icon-bg { background: var(--color-info-main); }
.activity-icon-wrapper.info .status-icon { color: var(--color-info-main); }

/* Missing status fallback */
.activity-icon-wrapper:not(.success):not(.error):not(.warning):not(.info) .activity-icon-bg { 
  background: var(--color-primary-main); 
}
.activity-icon-wrapper:not(.success):not(.error):not(.warning):not(.info) .status-icon { 
  color: var(--color-primary-main); 
}

/* ===== Glass Card (Activity Content) ===== */
.activity-content-box {
  flex: 1;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

:is(.dark) .activity-content-box {
  background: rgba(30, 41, 59, 0.3);
  border-color: rgba(255, 255, 255, 0.05);
}

.activity-item:hover .activity-content-box {
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
  border-color: rgba(var(--color-primary-main-rgb), 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

:is(.dark) .activity-item:hover .activity-content-box {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(var(--color-primary-main-rgb), 0.4);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.activity-item:hover .activity-icon-bg {
  opacity: 0.25;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.action-title {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}

.timestamp-badge {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

:is(.dark) .timestamp-badge {
  background: rgba(255, 255, 255, 0.06);
}

.timestamp-badge svg {
  width: 12px;
  height: 12px;
}

.activity-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* ===== Animations ===== */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-enter {
  animation: enterAnim 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--enter-delay, 0ms);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes enterAnim {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .activity-log-view {
    padding: 1.5rem 1rem;
  }
  
  .glass-container {
    padding: 1.5rem;
    border-radius: 20px;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }

  .title-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .title-icon-wrapper svg {
    width: 20px;
    height: 20px;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .activity-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .activity-content-box {
    padding: 1rem 1.25rem;
  }
  
  .refresh-btn {
    width: 100%;
    justify-content: center;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .orb,
  .animate-fade-in,
  .animate-enter {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
</style>
