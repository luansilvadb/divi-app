<template>
  <div class="subscriptions-view">
    <!-- Animated background orbs -->
    <div class="view-bg-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
    
    <!-- Noise texture overlay -->
    <div class="noise-overlay" aria-hidden="true"></div>

    <div class="view-content-wrapper">
      <header class="view-header">
        <div class="title-section">
          <div class="title-icon-wrapper">
            <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 3v6h-6"/><path d="M12 7v5l3 3"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Assinaturas e Recorrências</h1>
            <p class="subtitle">Gerencie seus serviços, planos e contas fixas</p>
          </div>
        </div>
        <button class="primary-btn pulse-hover" @click="showAddSubModal = true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nova Assinatura
        </button>
      </header>

      <div class="view-content">
        <div v-if="subscriptions.length === 0" class="empty-state glass-card">
          <div class="empty-content">
            <div class="empty-icon-wrapper">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M8 14h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M8 18h.01"></path>
                <path d="M12 18h.01"></path>
                <path d="M16 18h.01"></path>
              </svg>
            </div>
            <h3>Nenhuma assinatura registrada</h3>
            <p>Adicione suas assinaturas (Netflix, Spotify, Academia) para prever seus gastos mensais fixos com elegância.</p>
            <button class="primary-btn outline" @click="showAddSubModal = true">
              Começar Agora
            </button>
          </div>
        </div>

        <div v-else class="subscriptions-layout">
          <div class="subscriptions-list">
            <div 
              v-for="(sub, index) in sortedSubscriptions" 
              :key="sub.id" 
              class="sub-card glass-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="sub-info">
                <div class="sub-main">
                  <div class="sub-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div class="sub-details">
                    <h3>{{ sub.name }}</h3>
                    <span class="sub-billing">
                      <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      Dia {{ sub.billing_day }} &bull; {{ sub.frequency === 'monthly' ? 'Mensal' : 'Anual' }}
                    </span>
                  </div>
                </div>
                <div class="sub-value">
                  <span class="amount">{{ formatCurrency(sub.amount) }}</span>
                  <span v-if="sub.last_billed_at" class="last-billed">
                    <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Paga: {{ formatDate(sub.last_billed_at) }}
                  </span>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-actions">
                  <button class="action-btn text-danger" @click="deleteSub(sub.id)">
                    Remover
                  </button>
                  <button class="action-btn text-primary">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside class="summary-sidebar">
            <div class="glass-card impact-summary stagger-1">
              <div class="summary-header">
                <h3>Impacto Mensal</h3>
                <div class="icon-pulse">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
              </div>
              <div class="total-impact">
                <h2 class="value gradient-text">{{ formatCurrency(monthlyTotal) }}</h2>
                <p class="label">Total em assinaturas/mês</p>
              </div>
              <div class="impact-bar-container">
                <div class="impact-bar" :style="{ width: impactPercentage + '%' }">
                  <div class="impact-bar-glow"></div>
                </div>
              </div>
              <p class="impact-text">
                Compromete <strong>{{ impactPercentage.toFixed(1) }}%</strong> do seu orçamento de desejos.
              </p>
            </div>

            <div class="glass-card upcoming-bills stagger-2">
              <div class="summary-header">
                <h3>Próximas Cobranças</h3>
              </div>
              <div class="upcoming-list">
                <div v-for="sub in upcomingSubscriptions" :key="sub.id" class="upcoming-item">
                  <div class="day-badge">
                    <span class="day-number">{{ sub.billing_day }}</span>
                  </div>
                  <div class="upcoming-details">
                    <span class="name">{{ sub.name }}</span>
                    <span class="amount">{{ formatCurrency(sub.amount) }}</span>
                  </div>
                </div>
                <div v-if="upcomingSubscriptions.length === 0" class="no-upcoming">
                  Nenhuma cobrança próxima.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'

const financeStore = useFinanceStore()
const { subscriptions } = storeToRefs(financeStore)

const showAddSubModal = ref(false)

onMounted(async () => {
  await financeStore.fetchSubscriptions()
})

const sortedSubscriptions = computed(() => {
  return [...subscriptions.value].sort((a, b) => a.billing_day - b.billing_day)
})

const monthlyTotal = computed(() => {
  return subscriptions.value.reduce((total, sub) => {
    if (sub.frequency === 'monthly') return total + sub.amount
    return total + (sub.amount / 12)
  }, 0)
})

const impactPercentage = computed(() => {
  const wishesBudget = 2250.00
  return (monthlyTotal.value / wishesBudget) * 100
})

const upcomingSubscriptions = computed(() => {
  const today = new Date().getDate()
  return sortedSubscriptions.value
    .filter(s => s.billing_day >= today)
    .slice(0, 3)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const deleteSub = async (id: string) => {
  if (confirm('Deseja cancelar o acompanhamento desta assinatura?')) {
    await financeStore.deleteSubscription(id)
  }
}
</script>

<style scoped>
/* ===== Base View ===== */
.subscriptions-view {
  position: relative;
  min-height: 100%;
  padding: 2rem;
  overflow: hidden;
}

/* ===== Background Orbs & Noise ===== */
.view-bg-orbs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  will-change: transform;
}

:is(.dark) .orb {
  opacity: 0.2;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--color-primary-main);
  top: -10%;
  left: -5%;
  animation: float-1 20s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--color-secondary-main);
  bottom: -10%;
  right: -5%;
  animation: float-2 25s ease-in-out infinite;
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, 30px) scale(1.05); }
  66% { transform: translate(-20px, 40px) scale(0.95); }
}

@keyframes float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, -20px) scale(1.05); }
  66% { transform: translate(30px, -40px) scale(0.9); }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
}

/* ===== Content Wrapper ===== */
.view-content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== Header ===== */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
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
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary-main) 10%, transparent), color-mix(in srgb, var(--color-secondary-main) 10%, transparent));
  color: var(--color-primary-main);
  border: 1px solid color-mix(in srgb, var(--color-primary-main) 20%, transparent);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-main) 10%, transparent);
}

:is(.dark) .title-icon-wrapper {
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary-main) 20%, transparent), color-mix(in srgb, var(--color-secondary-main) 15%, transparent));
  border-color: color-mix(in srgb, var(--color-primary-main) 30%, transparent);
}

.title-icon {
  width: 24px;
  height: 24px;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.subtitle {
  margin: 0.25rem 0 0;
  font-size: 1rem;
  color: var(--color-text-secondary);
}

/* ===== Buttons ===== */
.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-main) 30%, transparent);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--color-primary-main) 40%, transparent);
}

.primary-btn:active {
  transform: translateY(0);
}

.primary-btn.outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-main);
  box-shadow: none;
}

.primary-btn.outline:hover {
  background: color-mix(in srgb, var(--color-primary-main) 5%, transparent);
  border-color: var(--color-primary-main);
}

:is(.dark) .primary-btn.outline:hover {
  background: color-mix(in srgb, var(--color-primary-main) 10%, transparent);
}

.action-btn {
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.text-danger {
  color: var(--color-error-main, #ef4444);
}
.text-danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.text-primary {
  color: var(--color-primary-main);
}
.text-primary:hover {
  background: color-mix(in srgb, var(--color-primary-main) 10%, transparent);
}

/* ===== Glass Card ===== */
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.02),
    0 8px 24px -8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}

:is(.dark) .glass-card {
  background: rgba(22, 27, 34, 0.65);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 8px 24px -8px rgba(0, 0, 0, 0.3);
}

/* ===== Empty State ===== */
.empty-state {
  padding: 5rem 2rem;
  text-align: center;
  animation: fade-in 0.8s ease both;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary-main) 8%, transparent), color-mix(in srgb, var(--color-secondary-main) 8%, transparent));
  color: var(--color-primary-main);
  margin-bottom: 1.5rem;
}

.empty-icon {
  width: 40px;
  height: 40px;
  opacity: 0.8;
}

.empty-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary);
}

.empty-content p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* ===== Subscriptions Layout ===== */
.subscriptions-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

.subscriptions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sub-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  position: relative;
  overflow: hidden;
}

.sub-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-primary-main), var(--color-secondary-main));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sub-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.1);
}

:is(.dark) .sub-card:hover {
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.4);
}

.sub-card:hover::before {
  opacity: 1;
}

.sub-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.sub-main {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.sub-icon {
  width: 52px;
  height: 52px;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary-main);
}

:is(.dark) .sub-icon {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.05);
}

.sub-icon svg {
  width: 24px;
  height: 24px;
}

.sub-details h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.sub-billing {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.inline-icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.sub-value {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sub-value .amount {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.last-billed {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-text-disabled);
}

.card-footer {
  border-top: 1px solid var(--color-border-main);
  padding-top: 1rem;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* ===== Summary Sidebar ===== */
.summary-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.summary-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.icon-pulse {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-primary-main) 10%, transparent);
  color: var(--color-primary-main);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-ring 2s infinite;
}

.icon-pulse svg {
  width: 16px;
  height: 16px;
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary-main) 40%, transparent); }
  70% { box-shadow: 0 0 0 10px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.impact-summary {
  padding: 1.5rem;
  animation: slide-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.total-impact {
  text-align: center;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

.total-impact .label {
  margin: 0.25rem 0 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.impact-bar-container {
  height: 10px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
}

:is(.dark) .impact-bar-container {
  background: rgba(255, 255, 255, 0.06);
}

.impact-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-main), var(--color-secondary-main));
  border-radius: 999px;
  position: relative;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.impact-bar-glow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
  filter: blur(4px);
  animation: slide-glow 2s infinite linear;
}

@keyframes slide-glow {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(200%); opacity: 0; }
}

.impact-text {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0;
}

.impact-text strong {
  color: var(--color-text-primary);
}

.upcoming-bills {
  padding: 1.5rem;
  animation: slide-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.upcoming-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

:is(.dark) .upcoming-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.day-badge {
  flex-shrink: 0;
  width: 44px;
  height: 48px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--color-secondary-main) 10%, transparent), color-mix(in srgb, var(--color-primary-main) 5%, transparent));
  border: 1px solid color-mix(in srgb, var(--color-secondary-main) 20%, transparent);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary-main);
}

.day-badge::before {
  content: 'DIA';
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

.day-number {
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1;
}

.upcoming-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.25rem;
}

.upcoming-details .name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.upcoming-details .amount {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.no-upcoming {
  text-align: center;
  padding: 1.5rem 0;
  color: var(--color-text-disabled);
  font-size: 0.9rem;
}

/* ===== Animations ===== */
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-left {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fade-in {
  from { opacity: 0; scale: 0.96; filter: blur(4px); }
  to { opacity: 1; scale: 1; filter: blur(0); }
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .subscriptions-layout {
    grid-template-columns: 1fr;
  }
  
  .summary-sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .subscriptions-view {
    padding: 1rem;
  }
  
  .view-header {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .sub-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .sub-value {
    text-align: left;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .last-billed {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orb,
  .icon-pulse,
  .impact-bar-glow,
  .sub-card,
  .impact-summary,
  .upcoming-bills,
  .view-header,
  .empty-state {
    animation: none !important;
    transition: none !important;
  }
}
</style>

