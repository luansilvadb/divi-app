<template>
  <div class="view-wrapper">
    <!-- Animated background orbs -->
    <BaseBackgroundOrbs />

    <!-- Noise texture overlay -->
    <div class="noise-overlay" aria-hidden="true"></div>

    <header class="view-header">
      <div class="title-section">
        <div class="title-icon-wrapper">
          <svg
            class="title-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">Controle de Dívidas</h1>
          <p class="subtitle">Acompanhe seus empréstimos, parcelamentos e planeje a quitação</p>
        </div>
      </div>
      <button class="primary-btn pulse-hover" @click="showAddLoanModal = true">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Novo Registro
      </button>
    </header>

    <div v-if="loans.length === 0" class="empty-state glass-card">
      <div class="empty-content">
        <div class="empty-icon-wrapper">
          <svg
            class="empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h3>Nenhum empréstimo ativo</h3>
        <p>
          Registre financiamentos ou dívidas para ter controle total sobre seu saldo devedor e
          juros pagos com elegância.
        </p>
        <button class="primary-btn outline" @click="showAddLoanModal = true">Registrar Primeiro Empréstimo</button>
      </div>
    </div>

    <div v-else class="view-content-grid">
      <div class="main-column loans-list">
        <div class="loans-grid">
          <LoanCard
            v-for="(loan, index) in loans"
            :key="loan.id"
            :loan="loan"
            :style="{ '--anim-delay': `${index * 0.1}s` }"
            @delete="deleteLoan(loan.id)"
          />
        </div>
      </div>

      <aside class="side-column summary-sidebar">
        <div class="glass-card impact-summary stagger-1">
          <div class="summary-header">
            <h3>Resumo de Dívidas</h3>
            <div class="icon-pulse">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div class="total-impact">
            <h2 class="value gradient-text">{{ formatNumber(totalDebt) }}</h2>
            <p class="label">Total Devedor</p>
          </div>
          <div class="impact-bar-container">
            <div class="impact-bar" :style="{ width: '100%' }">
              <div class="impact-bar-glow"></div>
            </div>
          </div>
          <p class="impact-text">
            Priorize quitar as dívidas que possuem <strong>maiores taxas de juros</strong> mensais.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'
import LoanCard from '../components/LoanCard.vue'
import BaseBackgroundOrbs from '@/shared/components/atoms/BaseBackgroundOrbs.vue'

const financeStore = useFinanceStore()
const { loans, totalDebt } = storeToRefs(financeStore)

const showAddLoanModal = ref(false)

onMounted(async () => {
  await financeStore.fetchLoans()
})

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const deleteLoan = async (id: string) => {
  if (confirm('Tem certeza que deseja remover este empréstimo?')) {
    await financeStore.deleteLoan(id)
  }
}
</script>

<style scoped>
.noise-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
}

/* ===== Header ===== */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.title-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary-main) 10%, transparent),
    color-mix(in srgb, var(--color-secondary-main) 10%, transparent)
  );
  color: var(--color-primary-main);
  border: 1px solid color-mix(in srgb, var(--color-primary-main) 20%, transparent);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary-main) 10%, transparent);
}

:is(.dark) .title-icon-wrapper {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary-main) 20%, transparent),
    color-mix(in srgb, var(--color-secondary-main) 15%, transparent)
  );
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
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s ease;
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
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary-main) 8%, transparent),
    color-mix(in srgb, var(--color-secondary-main) 8%, transparent)
  );
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

/* ===== Layout ===== */
.loans-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
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
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary-main) 40%, transparent);
  }
  70% {
    box-shadow: 0 0 0 10px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
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
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(200%);
    opacity: 0;
  }
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

/* ===== Animations ===== */
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-left {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    scale: 0.96;
    filter: blur(4px);
  }
  to {
    opacity: 1;
    scale: 1;
    filter: blur(0);
  }
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .view-content-grid {
    grid-template-columns: 1fr;
  }

  .summary-sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .view-wrapper {
    padding: 1rem;
  }

  .view-header {
    flex-direction: column;
    gap: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .icon-pulse,
  .impact-bar-glow,
  .loan-card,
  .impact-summary,
  .view-header,
  .empty-state {
    animation: none !important;
    transition: none !important;
  }
}
</style>
