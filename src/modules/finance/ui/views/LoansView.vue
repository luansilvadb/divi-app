<template>
  <div class="loans-view">
    <header class="view-header">
      <div class="title-section">
        <h1>Empréstimos e Financiamentos</h1>
        <p class="subtitle">Acompanhe suas dívidas de longo prazo e juros</p>
      </div>
      <BaseButton @click="showAddLoanModal = true">+ Novo Empréstimo</BaseButton>
    </header>

    <div class="view-content">
      <div v-if="loans.length === 0" class="empty-state">
        <BaseCard>
          <div class="empty-content">
            <span class="icon">🏛️</span>
            <h3>Nenhum empréstimo ativo</h3>
            <p>Registre seus financiamentos, empréstimos ou dívidas parceladas para acompanhar o saldo devedor.</p>
            <BaseButton variant="secondary" @click="showAddLoanModal = true">Registrar Primeiro</BaseButton>
          </div>
        </BaseCard>
      </div>

      <div v-else class="loans-grid">
        <div class="loans-list">
          <BaseCard v-for="loan in loans" :key="loan.id" class="loan-card">
            <div class="loan-info">
              <div class="loan-header">
                <h3>{{ loan.name }}</h3>
                <span class="due-date">Vence em: {{ formatDate(loan.due_date) }}</span>
              </div>
              
              <div class="loan-progress">
                <div class="progress-labels">
                  <span>Pago: {{ formatCurrency(loan.total_value - loan.remaining_value) }}</span>
                  <span>Total: {{ formatCurrency(loan.total_value) }}</span>
                </div>
                <div class="progress-bar-container">
                  <div 
                    class="progress-bar" 
                    :style="{ width: getProgress(loan) + '%' }"
                  ></div>
                </div>
                <div class="progress-percentage">
                  {{ getProgress(loan).toFixed(1) }}% amortizado
                </div>
              </div>

              <div class="loan-details">
                <div class="detail">
                  <span class="label">Saldo Restante</span>
                  <span class="value highlighting">{{ formatCurrency(loan.remaining_value) }}</span>
                </div>
                <div v-if="loan.interest_rate" class="detail">
                  <span class="label">Taxa de Juros</span>
                  <span class="value">{{ loan.interest_rate }}% a.m.</span>
                </div>
              </div>
            </div>
            <template #footer>
              <div class="card-actions">
                <BaseButton variant="secondary" size="sm" @click="deleteLoan(loan.id)">Remover</BaseButton>
                <BaseButton variant="primary" size="sm">Registrar Pagamento</BaseButton>
              </div>
            </template>
          </BaseCard>
        </div>

        <aside class="summary-sidebar">
          <BaseCard class="debt-summary">
            <template #header>Resumo de Dívidas</template>
            <div class="summary-total">
              <span class="label">Total Devedor</span>
              <h2 class="total-value">{{ formatCurrency(totalDebt) }}</h2>
            </div>
            <div class="debt-chart-placeholder">
              <!-- Placeholder for a mini debt distribution chart -->
              <div class="chart-mock">
                <div class="bar" style="height: 60%; background: #ef4444;"></div>
                <div class="bar" style="height: 40%; background: #f59e0b;"></div>
                <div class="bar" style="height: 20%; background: #3b82f6;"></div>
              </div>
              <p class="chart-label">Distribuição por Empréstimo</p>
            </div>
          </BaseCard>

          <BaseCard class="tips-card">
            <template #header>Dicas Financeiras</template>
            <ul class="tips-list">
              <li>Tente priorizar o pagamento das dívidas com <strong>maiores taxas de juros</strong>.</li>
              <li>Considere a portabilidade de crédito se encontrar taxas menores em outro banco.</li>
              <li>Evite comprometer mais de 30% da sua renda com parcelas de empréstimos.</li>
            </ul>
          </BaseCard>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
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
.loans-view {
  max-width: 1200px;
  margin: 0 auto;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.title-section h1 {
  margin: 0;
  font-size: 1.875rem;
  color: #111827;
}
.subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
}
.loans-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}
.loans-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.loan-card {
  transition: transform 0.2s;
}
.loan-card:hover {
  transform: translateY(-2px);
}
.loan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.loan-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}
.due-date {
  font-size: 0.875rem;
  color: #6b7280;
}
.loan-progress {
  margin-bottom: 1.5rem;
}
.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}
.progress-bar-container {
  height: 10px;
  background: #f3f4f6;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.progress-bar {
  height: 100%;
  background: #10b981;
  border-radius: 5px;
  transition: width 0.5s ease-out;
}
.progress-percentage {
  text-align: right;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
}
.loan-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}
.detail {
  display: flex;
  flex-direction: column;
}
.detail .label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.25rem;
}
.detail .value {
  font-weight: 600;
  color: #374151;
}
.detail .highlighting {
  color: #ef4444;
  font-size: 1.125rem;
}
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.summary-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.summary-total {
  text-align: center;
  padding: 1rem 0;
}
.summary-total .label {
  color: #6b7280;
  font-size: 0.875rem;
}
.total-value {
  margin: 0.5rem 0 0;
  color: #ef4444;
  font-size: 2rem;
}
.debt-chart-placeholder {
  margin-top: 1.5rem;
  text-align: center;
}
.chart-mock {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.5rem;
  height: 80px;
  margin-bottom: 0.5rem;
}
.chart-mock .bar {
  width: 20px;
  border-radius: 4px 4px 0 0;
}
.chart-label {
  font-size: 0.75rem;
  color: #9ca3af;
}
.tips-list {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}
.tips-list li {
  margin-bottom: 0.75rem;
}
.empty-state {
  text-align: center;
  padding: 4rem 0;
}
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.empty-content .icon {
  font-size: 4rem;
}

@media (max-width: 1024px) {
  .loans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
