<template>
  <div class="loans-page">
    <!-- Animated background orbs specific to this view -->
    <div class="loans-bg-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    
    <!-- Noise texture overlay -->
    <div class="noise-overlay" aria-hidden="true"></div>

    <div class="loans-content">
      <!-- Header -->
      <header class="page-header stagger-1">
        <div class="title-section">
          <div class="icon-wrapper">
            <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="url(#headerGrad)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 12h8"/><path d="M12 8v8"/>
              <defs>
                <linearGradient id="headerGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop stop-color="var(--color-primary-main)"/>
                  <stop offset="1" stop-color="var(--color-secondary-main)"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Empréstimos</h1>
            <p class="page-subtitle">Acompanhe suas dívidas de longo prazo e amortizações.</p>
          </div>
        </div>
        <button class="glass-btn primary" @click="showAddLoanModal = true">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Registro
        </button>
      </header>

      <!-- Empty State -->
      <div v-if="loans.length === 0" class="empty-state stagger-2">
        <div class="glass-card empty-card">
          <div class="empty-icon-container">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 class="empty-title">Nenhum empréstimo ativo</h3>
          <p class="empty-desc">Registre financiamentos ou dívidas para ter controle total sobre seu saldo devedor e juros pagos.</p>
          
          <div class="feature-pills">
            <span class="pill"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Simulação</span>
            <span class="pill"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Amortização</span>
          </div>

          <button class="glass-btn primary" @click="showAddLoanModal = true">
            Registrar Primeiro Empréstimo
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="loans-layout stagger-2">
        
        <!-- Summary Sidebar (changed to top metrics on small screens, side on large) -->
        <aside class="summary-section">
          <div class="glass-card summary-card">
            <h3 class="card-title">Resumo de Dívidas</h3>
            
            <div class="total-debt">
              <span class="label">Total Devedor</span>
              <div class="value-container">
                <span class="currency">R$</span>
                <span class="amount">{{ formatNumber(totalDebt) }}</span>
              </div>
            </div>

            <div class="divider">
              <div class="divider-line"></div>
              <span class="divider-text">distribuição</span>
              <div class="divider-line"></div>
            </div>

            <div class="chart-mock">
              <div class="chart-bars">
                <div class="bar bar-danger" style="height: 70%;"></div>
                <div class="bar bar-warning" style="height: 45%;"></div>
                <div class="bar bar-info" style="height: 30%;"></div>
              </div>
            </div>

            <div class="tips-box">
              <div class="tips-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>Dica</span>
              </div>
              <p>Priorize quitar as dívidas que possuem <strong>maiores taxas de juros</strong> mensais.</p>
            </div>
          </div>
        </aside>

        <!-- Loans Grid -->
        <main class="loans-grid">
          <div 
            v-for="(loan, index) in loans" 
            :key="loan.id" 
            class="glass-card loan-card"
            :style="{ '--anim-delay': `${index * 0.1 + 0.3}s` }"
          >
            <div class="card-top">
              <div class="loan-identity">
                <div class="loan-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <div>
                  <h3 class="loan-name">{{ loan.name }}</h3>
                  <span class="loan-due">Vence: {{ formatDate(loan.due_date) }}</span>
                </div>
              </div>
            </div>

            <div class="loan-metrics">
              <div class="metric">
                <span class="label">Saldo Devedor</span>
                <span class="value emphasis">{{ formatCurrency(loan.remaining_value) }}</span>
              </div>
              <div class="metric">
                <span class="label">Taxa</span>
                <span class="value badge">{{ loan.interest_rate || '0' }}% a.m.</span>
              </div>
            </div>

            <div class="loan-progress-section">
              <div class="progress-info">
                <span>{{ getProgress(loan).toFixed(1) }}% pago</span>
                <span>de {{ formatCurrency(loan.total_value) }}</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: getProgress(loan) + '%' }"></div>
              </div>
            </div>

            <div class="card-actions">
              <button class="glass-btn secondary small" @click="deleteLoan(loan.id)">Remover</button>
              <button class="glass-btn primary small outline">Registrar Parcela</button>
            </div>
          </div>
        </main>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'
import type { Loan } from '@/modules/finance/domain/entities'

const financeStore = useFinanceStore()
const { loans, totalDebt } = storeToRefs(financeStore)

const showAddLoanModal = ref(false)

onMounted(async () => {
  await financeStore.fetchLoans()
})

const getProgress = (loan: Loan) => {
  if (loan.total_value === 0) return 0
  const paid = loan.total_value - loan.remaining_value
  return (paid / loan.total_value) * 100
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const deleteLoan = async (id: string) => {
  if (confirm('Tem certeza que deseja remover este empréstimo?')) {
    await financeStore.deleteLoan(id)
  }
}
</script>

<style scoped>
/* ===== Page Layout ===== */
.loans-page {
  position: relative;
  min-height: 100%;
  padding: 2rem;
  overflow: hidden;
}

/* ===== Ambient Background Effects ===== */
.loans-bg-orbs {
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
  width: 400px;
  height: 400px;
  background: var(--color-primary-main);
  top: -100px;
  left: -100px;
  animation: float-1 22s ease-in-out infinite alternate;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: var(--color-secondary-main);
  bottom: -150px;
  right: -50px;
  animation: float-2 26s ease-in-out infinite alternate-reverse;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: var(--color-accent-main);
  top: 40%;
  left: 30%;
  opacity: 0.08;
  animation: float-3 20s ease-in-out infinite;
}

@keyframes float-1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(80px, 50px) scale(1.1); }
}

@keyframes float-2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-60px, -40px) scale(1.05); }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(40px, -60px); }
}

/* ===== Noise Overlay ===== */
.noise-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
}

/* ===== Main Content Container ===== */
.loans-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* ===== Animation Staggers ===== */
.stagger-1 { animation: content-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
.stagger-2 { animation: content-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }

@keyframes content-enter {
  from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* ===== Glass Card Base ===== */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1.25rem;
  box-shadow:
    0 4px 20px -2px rgba(0, 0, 0, 0.05),
    0 12px 32px -8px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

:is(.dark) .glass-card {
  background: rgba(22, 27, 34, 0.65);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 20px -2px rgba(0, 0, 0, 0.4),
    0 12px 32px -8px rgba(0, 0, 0, 0.3);
}

/* ===== Buttons ===== */
.glass-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
}

.glass-btn.small {
  padding: 0.5rem 0.875rem;
  font-size: 0.8rem;
}

.glass-btn .btn-icon {
  width: 18px;
  height: 18px;
}

.glass-btn.primary {
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba(var(--color-primary-main), 0.2);
}

.glass-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--color-primary-main), 0.3);
}

.glass-btn.primary.outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-main);
  box-shadow: none;
}

.glass-btn.primary.outline:hover {
  border-color: var(--color-primary-main);
  background: rgba(var(--color-primary-main), 0.05);
}

:is(.dark) .glass-btn.primary.outline:hover {
  background: rgba(var(--color-primary-main), 0.15);
}

.glass-btn.secondary {
  background: var(--color-surface-main);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-main);
}

.glass-btn.secondary:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--color-error-main);
  border-color: rgba(var(--color-error-main), 0.3);
}

:is(.dark) .glass-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* ===== Header ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

:is(.dark) .icon-wrapper {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.header-icon {
  width: 24px;
  height: 24px;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  line-height: 1.1;
}

.page-subtitle {
  margin: 0.25rem 0 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.empty-card {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.empty-icon-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(var(--color-primary-main), 0.1), rgba(var(--color-secondary-main), 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary-main);
  margin-bottom: 0.5rem;
}

.empty-icon {
  width: 36px;
  height: 36px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.empty-desc {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* ===== Feature Pills ===== */
.feature-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

:is(.dark) .pill {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}

.pill svg {
  width: 14px;
  height: 14px;
  color: var(--color-secondary-main);
}

/* ===== Layout Options ===== */
.loans-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  align-items: start;
}

/* ===== Summary Sidebar ===== */
.summary-card {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.total-debt {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.total-debt .label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-disabled);
  font-weight: 600;
}

.value-container {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.value-container .currency {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-error-main);
  opacity: 0.8;
}

.value-container .amount {
  font-size: 2.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-error-main);
  line-height: 1;
}

/* Divider inside card */
.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-main), transparent);
}

.divider-text {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-disabled);
}

.chart-mock {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 0.75rem;
  padding: 1rem;
  height: 120px;
  display: flex;
  align-items: flex-end;
}

:is(.dark) .chart-mock {
  background: rgba(255, 255, 255, 0.02);
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  gap: 0.5rem;
}

.bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  background: var(--color-primary-main);
  transition: height 1s ease;
}

.bar-danger { background: var(--color-error-main); opacity: 0.8; }
.bar-warning { background: var(--color-warning-main); opacity: 0.8; }
.bar-info { background: var(--color-info-main); opacity: 0.8; }

.tips-box {
  background: rgba(var(--color-info-main), 0.1);
  border-left: 3px solid var(--color-info-main);
  padding: 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-info-main);
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.tips-header svg {
  width: 16px;
  height: 16px;
}

.tips-box p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

/* ===== Loans Grid ===== */
.loans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.loan-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
  animation: card-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--anim-delay, 0s);
}

@keyframes card-enter {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.loan-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px -10px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(var(--color-primary-main), 0.1);
}

:is(.dark) .loan-card:hover {
  box-shadow: 
    0 12px 40px -10px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(var(--color-primary-main), 0.3);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.loan-identity {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.loan-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-surface-main);
  border: 1px solid var(--color-border-main);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary-main);
}

.loan-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
}

.loan-due {
  font-size: 0.8rem;
  color: var(--color-text-disabled);
}

.loan-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.02);
  padding: 1rem;
  border-radius: 0.75rem;
}

:is(.dark) .loan-metrics {
  background: rgba(255, 255, 255, 0.02);
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric .label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-disabled);
}

.metric .value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.metric .value.emphasis {
  font-size: 1.125rem;
  color: var(--color-error-main);
}

.metric .badge {
  display: inline-flex;
  width: fit-content;
  padding: 0.125rem 0.5rem;
  background: rgba(var(--color-primary-main), 0.1);
  color: var(--color-primary-main);
  border-radius: 999px;
  font-size: 0.8rem;
}

:is(.dark) .metric .badge {
  color: var(--color-text-primary);
  background: rgba(var(--color-primary-main), 0.3);
}

.loan-progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.progress-track {
  height: 8px;
  background: var(--color-border-main);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-main), var(--color-secondary-main));
  border-radius: 999px;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .loans-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .loans-page {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .loans-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .orb, .page-header, .empty-state, .loans-layout, .loan-card, .progress-fill {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
