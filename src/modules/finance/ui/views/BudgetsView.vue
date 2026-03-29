<template>
  <div class="budgets-view">
    <header class="view-header">
      <div class="title-section">
        <h1>Orçamentos</h1>
        <p class="subtitle">Acompanhe seus limites de gastos (Regra 50/30/20)</p>
      </div>
      <BaseButton @click="showAddBudgetModal = true">+ Novo Orçamento</BaseButton>
    </header>

    <div class="budgets-grid">
      <div v-if="budgets.length === 0" class="empty-state">
        <BaseCard>
          <div class="empty-content">
            <span class="icon">📊</span>
            <h3>Nenhum orçamento definido</h3>
            <p>Crie orçamentos para controlar seus gastos essenciais, desejos e investimentos.</p>
            <BaseButton variant="secondary" @click="showAddBudgetModal = true">Começar Agora</BaseButton>
          </div>
        </BaseCard>
      </div>
      
      <div v-else class="budgets-list">
        <BudgetCard 
          v-for="budget in budgets" 
          :key="budget.id" 
          :budget="budget" 
          :consumed="getConsumed(budget)"
        />
      </div>

      <aside class="summary-sidebar">
        <BaseCard class="rule-explanation">
          <template #header>Regra 50/30/20</template>
          <ul class="rule-list">
            <li><strong>50% Necessidades:</strong> Aluguel, contas, mercado, saúde.</li>
            <li><strong>30% Desejos:</strong> Lazer, assinaturas, jantar fora.</li>
            <li><strong>20% Dívidas/Investimentos:</strong> Reserva, ações, pagar empréstimos.</li>
          </ul>
        </BaseCard>
        
        <BaseCard class="current-summary">
          <template #header>Resumo do Mês</template>
          <div class="summary-item">
            <span>Total Orçado:</span>
            <strong>{{ formatCurrency(totalBudgeted) }}</strong>
          </div>
          <div class="summary-item">
            <span>Total Gasto:</span>
            <strong :class="{ 'over': totalConsumed > totalBudgeted }">
              {{ formatCurrency(totalConsumed) }}
            </strong>
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
.budgets-view {
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
.budgets-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}
.empty-state {
  text-align: center;
  padding: 3rem 0;
}
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.empty-content .icon {
  font-size: 3rem;
}
.empty-content h3 {
  margin: 0;
  color: #374151;
}
.empty-content p {
  color: #6b7280;
  max-width: 300px;
}
.summary-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.rule-list {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4b5563;
}
.rule-list li {
  margin-bottom: 0.75rem;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
}
.summary-item:last-child {
  margin-bottom: 0;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}
.over {
  color: #ef4444;
}

@media (max-width: 1024px) {
  .budgets-grid {
    grid-template-columns: 1fr;
  }
}
</style>
