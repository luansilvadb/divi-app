<template>
  <div class="budgets-view animate-fade-in">
    <!-- Background Orbs (Glassmorphism effect similar to Login/Dashboard) -->
    <div class="background-orbs" aria-hidden="true">
      <div class="glass-orb orb-primary"></div>
      <div class="glass-orb orb-secondary"></div>
      <div class="glass-orb orb-accent"></div>
    </div>

    <!-- Header Section -->
    <header class="view-header">
      <div class="title-section">
        <h1 class="page-title">Meus <span class="text-primary-main">Orçamentos</span></h1>
        <p class="page-subtitle">Acompanhe seus limites de gastos inteligentes com a Regra 50/30/20.</p>
      </div>
      <BaseButton 
        variant="primary" 
        class="create-budget-btn"
        @click="showAddBudgetModal = true"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </template>
        Novo Orçamento
      </BaseButton>
    </header>

    <div class="budgets-content-grid">
      <!-- Main Content (Budgets List) -->
      <main class="main-column">
        <div v-if="budgets.length === 0" class="empty-state glass-card hover-glow">
          <div class="empty-content">
            <div class="empty-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-svg"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3>Nenhum orçamento ativo</h3>
            <p>Crie limites para controlar melhor seus gastos essenciais, conforto e investimentos.</p>
            <BaseButton variant="primary" class="mt-4" @click="showAddBudgetModal = true">
              Começar a organizar
            </BaseButton>
          </div>
        </div>
        
        <div v-else class="budgets-list">
          <!-- The BudgetCard component handles its own glass-card style now -->
          <BudgetCard 
            v-for="budget in budgets" 
            :key="budget.id" 
            :budget="budget" 
            :consumed="getConsumed(budget)"
          />
        </div>
      </main>

      <!-- Sidebar -->
      <aside class="side-column">
        <!-- Summary Premium Card -->
        <BaseCard class="summary-card glass-card hover-glow">
          <template #header>
            <div class="card-header-flex">
              Visão Geral do Mês
            </div>
          </template>
          <div class="summary-details">
            <div class="summary-item">
              <div class="summary-icon bg-info-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-info-main)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <div class="summary-text">
                <span class="label">Total Orçado</span>
                <strong class="value">{{ formatCurrency(totalBudgeted) }}</strong>
              </div>
            </div>
            
            <div class="summary-divider"></div>

            <div class="summary-item">
              <div class="summary-icon" :class="totalConsumed > totalBudgeted ? 'bg-error-light' : 'bg-primary-light'">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="totalConsumed > totalBudgeted ? 'var(--color-error-main)' : 'var(--color-primary-main)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div class="summary-text">
                <span class="label">Gasto Acumulado</span>
                <strong class="value" :class="{ 'text-error-main': totalConsumed > totalBudgeted }">
                  {{ formatCurrency(totalConsumed) }}
                </strong>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Rule Explanation Card -->
        <BaseCard class="rule-card glass-card">
          <template #header>
            <div class="card-header-flex">
              Metodologia 50/30/20
            </div>
          </template>
          <div class="rule-explanation">
            <p class="rule-intro">A maneira mais simples de organizar suas finanças mantendo equilíbrio.</p>
            
            <ul class="rule-timeline">
              <li class="timeline-item">
                <div class="timeline-marker needs-marker"></div>
                <div class="timeline-content">
                  <h4 class="needs-title">50% Essenciais</h4>
                  <p>Moradia, contas básicas, mercado, saúde urbana e transporte.</p>
                </div>
              </li>
              <li class="timeline-item">
                <div class="timeline-marker wants-marker"></div>
                <div class="timeline-content">
                  <h4 class="wants-title">30% Estilo de Vida</h4>
                  <p>Lazer, hobbies, restaurantes, streaming e viagens curtas.</p>
                </div>
              </li>
              <li class="timeline-item">
                <div class="timeline-marker savings-marker"></div>
                <div class="timeline-content">
                  <h4 class="savings-title">20% Futuro</h4>
                  <p>Reserva de emergência, quitação de dívidas e investimentos.</p>
                </div>
              </li>
            </ul>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BudgetCard from '../components/BudgetCard.vue'
import type { Budget } from '@/modules/finance/domain/entities'

const showAddBudgetModal = ref(false)

// Mocks for now - will be replaced by store integration
const budgets = ref<Budget[]>([
  {
    id: '1',
    user_id: 'user1',
    name: 'Essenciais (50%)',
    type: 'spending',
    limit_value: 3750.00,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
    color: '#3b82f6', // blue
    created_at: '2026-03-01'
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'Desejos (30%)',
    type: 'spending',
    limit_value: 2250.00,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
    color: '#f59e0b', // amber
    created_at: '2026-03-01'
  },
  {
    id: '3',
    user_id: 'user1',
    name: 'Investimentos (20%)',
    type: 'saving',
    limit_value: 1500.00,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
    color: '#10b981', // emerald
    created_at: '2026-03-01'
  }
])

const consumedData = ref<Record<string, number>>({
  '1': 2450.00,
  '2': 1890.00,
  '3': 1500.00
})

const getConsumed = (budget: Budget) => consumedData.value[budget.id] || 0

const totalBudgeted = computed(() => budgets.value.reduce((sum, b) => sum + b.limit_value, 0))
const totalConsumed = computed(() => budgets.value.reduce((sum, b) => sum + getConsumed(b), 0))

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>

<style scoped>
/* Main View Container */
.budgets-view {
  width: 100%;
  padding: 2rem 2.5rem;
  position: relative;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: calc(100vh - 60px); /* Adjust based on your header/layout */
}

/* Background Decorations */
.background-orbs {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
  will-change: transform;
}

:is(.dark) .glass-orb {
  opacity: 0.1;
}

.orb-primary {
  width: 450px;
  height: 450px;
  background: var(--color-primary-main, #3b82f6);
  top: -150px;
  right: -50px;
  animation: orb-float-1 20s ease-in-out infinite alternate;
}

.orb-secondary {
  width: 350px;
  height: 350px;
  background: var(--color-secondary-main, #10b981);
  bottom: 100px;
  left: -100px;
  animation: orb-float-2 25s ease-in-out infinite alternate;
}

.orb-accent {
  width: 250px;
  height: 250px;
  background: var(--color-accent-main, #f59e0b);
  top: 40%;
  left: 30%;
  animation: orb-float-3 15s ease-in-out infinite alternate;
  opacity: 0.08;
}

@keyframes orb-float-1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-50px, 80px) scale(1.1); }
}

@keyframes orb-float-2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(80px, -50px) scale(1.15); }
}

@keyframes orb-float-3 {
  0% { transform: translate(0, 0) scale(1) rotate(0); }
  100% { transform: translate(50px, 50px) scale(0.9) rotate(45deg); }
}

/* Glass Cards & Effects */
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

:is(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}

.hover-glow:hover {
  border-color: rgba(var(--color-primary-main-rgb), 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Header Styles */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary, #111827);
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.text-primary-main {
  color: var(--color-primary-main, #3b82f6);
}

.page-subtitle {
  color: var(--color-text-secondary, #6b7280);
  font-size: 1.05rem;
  margin: 0;
}

.create-budget-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(var(--color-primary-main-rgb), 0.25);
}

/* Layout Grid */
.budgets-content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2.5rem;
  width: 100%;
}

.main-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 1.5rem;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 2rem;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.empty-icon-wrapper {
  width: 96px;
  height: 96px;
  background: linear-gradient(135deg, rgba(var(--color-primary-main-rgb), 0.1), rgba(var(--color-secondary-main-rgb), 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--color-primary-main, #3b82f6);
}

.empty-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary, #111827);
  margin: 0 0 0.75rem;
}

.empty-content p {
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

/* Sidebar Summaries */
.card-header-flex {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary, #111827);
  letter-spacing: -0.01em;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.summary-divider {
  height: 1px;
  background: rgba(0,0,0,0.06);
  margin: 0.25rem 0;
}

:is(.dark) .summary-divider {
  background: rgba(255,255,255,0.06);
}

.summary-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-info-light { background: rgba(var(--color-info-main-rgb, 59, 130, 246), 0.1); }
.bg-primary-light { background: rgba(var(--color-primary-main-rgb, 16, 185, 129), 0.1); }
.bg-error-light { background: rgba(var(--color-error-main-rgb, 239, 68, 68), 0.1); }

.summary-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-text .label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-text .value {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text-primary, #111827);
}

.text-error-main {
  color: var(--color-error-main, #ef4444) !important;
}

/* Timeline Rule */
.rule-explanation {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rule-intro {
  color: var(--color-text-secondary, #4b5563);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.rule-timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

.rule-timeline::before {
  content: '';
  position: absolute;
  top: 10px;
  bottom: 0;
  left: 7px;
  width: 2px;
  background: rgba(0,0,0,0.05);
  border-radius: 2px;
}

:is(.dark) .rule-timeline::before {
  background: rgba(255,255,255,0.05);
}

.timeline-item {
  display: flex;
  gap: 1.25rem;
  position: relative;
}

.timeline-marker {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 4px solid var(--color-primary-main);
  box-shadow: 0 0 0 4px rgba(var(--color-primary-main-rgb), 0.1);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  margin-top: 2px;
}

:is(.dark) .timeline-marker {
  background: #1e293b;
}

.needs-marker { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
.wants-marker { border-color: #f59e0b; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1); }
.savings-marker { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

.needs-title { color: #3b82f6; }
.wants-title { color: #f59e0b; }
.savings-title { color: #10b981; }

.timeline-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 700;
}

.timeline-content p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-text-secondary, #6b7280);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments */
@media (max-width: 1100px) {
  .budgets-content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .side-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .budgets-view {
    padding: 1.5rem 1rem;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .create-budget-btn {
    width: 100%;
  }

  .side-column {
    grid-template-columns: 1fr;
  }
}
</style>
