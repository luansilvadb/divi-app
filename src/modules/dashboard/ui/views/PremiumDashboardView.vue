<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '../../application/stores/dashboardStore'
import {
  PremiumBackground,
  PremiumCard,
  PremiumButton,
  PremiumSkeleton,
} from '../components/premium'
import PremiumDashboardLayout from '../components/premium/PremiumDashboardLayout.vue'

const store = useDashboardStore()
const isLoading = computed(() => store.isLoading)

// Mock data for demonstration
const stats = ref([
  { label: 'Total Investido', value: 'R$ 45.230,00', change: '+12.5%', positive: true },
  { label: 'Retorno Mensal', value: 'R$ 2.890,00', change: '+8.3%', positive: true },
  { label: 'Dividendos', value: 'R$ 450,00', change: '-2.1%', positive: false },
  { label: 'Patrimônio', value: 'R$ 128.940,00', change: '+15.7%', positive: true },
])

const recentActivity = ref([
  { type: 'buy', asset: 'ITUB4', amount: '500un', value: 'R$ 12.450,00', date: 'Hoje, 10:32' },
  { type: 'dividend', asset: 'BBDC4', amount: '', value: 'R$ 230,00', date: 'Ontem, 18:00' },
  { type: 'sell', asset: 'PETR4', amount: '200un', value: 'R$ 8.900,00', date: 'Ontem, 14:15' },
])

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
})

// Animated counter helper
const animatedValue = ref(0)
onMounted(() => {
  // Simular animação de contador
  const target = 128940
  const duration = 1500
  const steps = 60
  const increment = target / steps
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedValue.value = target
      clearInterval(timer)
    } else {
      animatedValue.value = Math.floor(current)
    }
  }, duration / steps)
})
</script>

<template>
  <PremiumBackground variant="gradient">
    <PremiumDashboardLayout template="default">
      <!-- Header -->
      <template #header>
        <div class="premium-header">
          <div class="premium-header__greeting">
            <h1 class="premium-header__title">
              {{ greeting }}, <span class="premium-header__name">Investidor</span>
            </h1>
            <p class="premium-header__subtitle">
              Seu patrimônio está performando bem este mês
            </p>
          </div>
          <div class="premium-header__actions">
            <PremiumButton variant="secondary" size="sm">
              <template #icon>
                <i class="i-lucide-bell" />
              </template>
              Notificações
            </PremiumButton>
            <PremiumButton variant="primary" size="sm">
              <template #icon>
                <i class="i-lucide-plus" />
              </template>
              Nova Operação
            </PremiumButton>
          </div>
        </div>
      </template>

      <!-- Summary Stats -->
      <template #summary>
        <PremiumCard
          v-for="(stat, index) in stats"
          :key="index"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 + 100, duration: 500 } }"
          variant="glass"
          class="premium-stat-card"
        >
          <div class="premium-stat-card__content">
            <span class="premium-stat-card__label">{{ stat.label }}</span>
            <div class="premium-stat-card__value-row">
              <span v-if="!isLoading" class="premium-stat-card__value">{{ stat.value }}</span>
              <PremiumSkeleton v-else variant="text" width="120px" />
              <span
                class="premium-stat-card__change"
                :class="stat.positive ? 'premium-stat-card__change--positive' : 'premium-stat-card__change--negative'"
              >
                {{ stat.change }}
              </span>
            </div>
          </div>
        </PremiumCard>
      </template>

      <!-- Main Chart -->
      <template #main-chart>
        <PremiumCard variant="glass" class="premium-chart-card">
          <div class="premium-chart-card__header">
            <h3 class="premium-chart-card__title">Evolução do Patrimônio</h3>
            <div class="premium-chart-card__period">
              <PremiumButton variant="ghost" size="sm">7D</PremiumButton>
              <PremiumButton variant="ghost" size="sm">1M</PremiumButton>
              <PremiumButton variant="primary" size="sm">3M</PremiumButton>
              <PremiumButton variant="ghost" size="sm">1A</PremiumButton>
            </div>
          </div>
          <div class="premium-chart-card__chart">
            <PremiumSkeleton v-if="isLoading" variant="rect" height="300px" />
            <div v-else class="premium-chart-placeholder">
              <!-- Placeholder para gráfico -->
              <svg viewBox="0 0 800 300" class="premium-chart-svg">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(212, 175, 55, 0.3)" />
                    <stop offset="100%" stop-color="rgba(212, 175, 55, 0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,250 Q100,200 200,220 T400,180 T600,150 T800,100 L800,300 L0,300 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M0,250 Q100,200 200,220 T400,180 T600,150 T800,100"
                  fill="none"
                  stroke="#d4af37"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </PremiumCard>
      </template>

      <!-- Side Stats -->
  <template #side-stats>
        <PremiumCard variant="glass" class="premium-side-card">
          <h3 class="premium-side-card__title">Distribuição</h3>
          <div class="premium-side-card__content">
            <PremiumSkeleton v-if="isLoading" variant="circle" width="200px" height="200px" />
            <div v-else class="premium-distribution">
              <div class="premium-distribution__item">
                <span class="premium-distribution__color" style="background: #d4af37;" />
                <span class="premium-distribution__label">Ações (45%)</span>
              </div>
              <div class="premium-distribution__item">
                <span class="premium-distribution__color" style="background: #b87333;" />
                <span class="premium-distribution__label">FIIs (30%)</span>
              </div>
              <div class="premium-distribution__item">
                <span class="premium-distribution__color" style="background: #64748b;" />
                <span class="premium-distribution__label">Renda Fixa (20%)</span>
              </div>
              <div class="premium-distribution__item">
                <span class="premium-distribution__color" style="background: #94a3b8;" />
                <span class="premium-distribution__label">Caixa (5%)</span>
              </div>
            </div>
          </div>
        </PremiumCard>
      </template>

      <!-- Recent Activity -->
      <template #recent-activity>
        <PremiumCard variant="glass" class="premium-activity-card">
          <h3 class="premium-activity-card__title">Atividade Recente</h3>
          <div class="premium-activity-card__list">
            <PremiumSkeleton v-if="isLoading" :lines="3" />
            <div
              v-for="(activity, index) in recentActivity"
              v-else
              :key="index"
              v-motion
              :initial="{ opacity: 0, x: -10 }"
              :enter="{ opacity: 1, x: 0, transition: { delay: index * 100 + 300, duration: 400 } }"
              class="premium-activity-item"
            >
              <div class="premium-activity-item__icon" :class="`premium-activity-item__icon--${activity.type}`">
                <i :class="{
                  'i-lucide-trending-up': activity.type === 'buy',
                  'i-lucide-trending-down': activity.type === 'sell',
                  'i-lucide-coins': activity.type === 'dividend'
                }" />
              </div>
              <div class="premium-activity-item__details">
                <span class="premium-activity-item__asset">{{ activity.asset }}</span>
                <span v-if="activity.amount" class="premium-activity-item__amount">{{ activity.amount }}</span>
              </div>
              <div class="premium-activity-item__value">
                <span class="premium-activity-item__amount-value">{{ activity.value }}</span>
                <span class="premium-activity-item__date">{{ activity.date }}</span>
              </div>
            </div>
          </div>
        </PremiumCard>
      </template>

      <!-- Footer -->
      <template #footer>
        <div class="premium-footer">
          <p class="premium-footer__text">
            Última atualização: {{ new Date().toLocaleTimeString('pt-BR') }}
          </p>
        </div>
      </template>
    </PremiumDashboardLayout>
  </PremiumBackground>
</template>

<style scoped>
/* Header Styles */
.premium-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
}

.premium-header__greeting {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.premium-header__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.premium-header__name {
  color: var(--color-accent-gold);
}

.premium-header__subtitle {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.premium-header__actions {
  display: flex;
  gap: var(--space-3);
}

/* Stat Card Styles */
.premium-stat-card {
  min-width: 0;
}

.premium-stat-card :deep(.premium-card__content) {
  padding: var(--space-5);
}

.premium-stat-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.premium-stat-card__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.premium-stat-card__value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.premium-stat-card__value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.premium-stat-card__change {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
}

.premium-stat-card__change--positive {
  color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
}

.premium-stat-card__change--negative {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

/* Chart Card Styles */
.premium-chart-card {
  height: 100%;
}

.premium-chart-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.premium-chart-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.premium-chart-card__period {
  display: flex;
  gap: var(--space-1);
}

.premium-chart-card__chart {
  min-height: 300px;
}

.premium-chart-placeholder {
  width: 100%;
  height: 300px;
}

.premium-chart-svg {
  width: 100%;
  height: 100%;
}

/* Side Card Styles */
.premium-side-card__title,
.premium-activity-card__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6) 0;
}

.premium-side-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.premium-distribution {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.premium-distribution__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.premium-distribution__color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.premium-distribution__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* Activity Card Styles */
.premium-activity-card__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.premium-activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  transition: background var(--duration-fast) var(--ease-smooth);
}

.premium-activity-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.premium-activity-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
}

.premium-activity-item__icon--buy {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
}

.premium-activity-item__icon--sell {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.premium-activity-item__icon--dividend {
  background: rgba(212, 175, 55, 0.1);
  color: var(--color-accent-gold);
}

.premium-activity-item__details {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-1);
}

.premium-activity-item__asset {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.premium-activity-item__amount {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

.premium-activity-item__value {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.premium-activity-item__amount-value {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.premium-activity-item__date {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* Footer Styles */
.premium-footer {
  display: flex;
  justify-content: center;
  padding-top: var(--space-6);
}

.premium-footer__text {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .premium-header {
    flex-direction: column;
    gap: var(--space-4);
  }

  .premium-header__title {
    font-size: var(--text-2xl);
  }

  .premium-header__actions {
    width: 100%;
    justify-content: stretch;
  }

  .premium-chart-card__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .premium-activity-item {
    flex-wrap: wrap;
  }

  .premium-activity-item__value {
    width: 100%;
    align-items: flex-start;
    margin-left: 56px;
  }
}
</style>
