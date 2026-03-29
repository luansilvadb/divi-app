<template>
  <div class="subscriptions-view">
    <header class="view-header">
      <div class="title-section">
        <h1>Assinaturas e Recorrências</h1>
        <p class="subtitle">Gerencie seus serviços de streaming, planos e contas fixas</p>
      </div>
      <BaseButton @click="showAddSubModal = true">+ Nova Assinatura</BaseButton>
    </header>

    <div class="view-content">
      <div v-if="subscriptions.length === 0" class="empty-state">
        <BaseCard>
          <div class="empty-content">
            <span class="icon">📅</span>
            <h3>Nenhuma assinatura registrada</h3>
            <p>Adicione suas assinaturas (Netflix, Spotify, Academia) para prever seus gastos mensais fixos.</p>
            <BaseButton variant="secondary" @click="showAddSubModal = true">Adicionar Agora</BaseButton>
          </div>
        </BaseCard>
      </div>

      <div v-else class="subscriptions-grid">
        <div class="subscriptions-list">
          <BaseCard v-for="sub in sortedSubscriptions" :key="sub.id" class="sub-card">
            <div class="sub-info">
              <div class="sub-main">
                <div class="sub-icon">📦</div>
                <div class="sub-details">
                  <h3>{{ sub.name }}</h3>
                  <span class="sub-billing">Cobra todo dia {{ sub.billing_day }} ({{ sub.frequency === 'monthly' ? 'Mensal' : 'Anual' }})</span>
                </div>
              </div>
              <div class="sub-value">
                <span class="amount">{{ formatCurrency(sub.amount) }}</span>
                <span v-if="sub.last_billed_at" class="last-billed">Última: {{ formatDate(sub.last_billed_at) }}</span>
              </div>
            </div>
            <template #footer>
              <div class="card-actions">
                <BaseButton variant="secondary" size="sm" @click="deleteSub(sub.id)">Remover</BaseButton>
                <BaseButton variant="primary" size="sm">Ver Histórico</BaseButton>
              </div>
            </template>
          </BaseCard>
        </div>

        <aside class="summary-sidebar">
          <BaseCard class="impact-summary">
            <template #header>Impacto Mensal</template>
            <div class="total-impact">
              <h2 class="value">{{ formatCurrency(monthlyTotal) }}</h2>
              <p class="label">Total em assinaturas/mês</p>
            </div>
            <div class="impact-bar-container">
              <div class="impact-bar" :style="{ width: impactPercentage + '%' }"></div>
            </div>
            <p class="impact-text">
              Representa <strong>{{ impactPercentage.toFixed(1) }}%</strong> do seu orçamento de "Desejos".
            </p>
          </BaseCard>

          <BaseCard class="upcoming-bills">
            <template #header>Próximas Cobranças</template>
            <div class="upcoming-list">
              <div v-for="sub in upcomingSubscriptions" :key="sub.id" class="upcoming-item">
                <span class="day">{{ sub.billing_day }}</span>
                <span class="name">{{ sub.name }}</span>
                <span class="amount">{{ formatCurrency(sub.amount) }}</span>
              </div>
            </div>
          </BaseCard>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'

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
  // Assuming a static reference for now, could be dynamic from budgets
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
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const deleteSub = async (id: string) => {
  if (confirm('Deseja cancelar o acompanhamento desta assinatura?')) {
    await financeStore.deleteSubscription(id)
  }
}
</script>

<style scoped>
.subscriptions-view {
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
.subscriptions-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}
.subscriptions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sub-card {
  transition: transform 0.2s;
}
.sub-card:hover {
  transform: translateX(4px);
}
.sub-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sub-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.sub-icon {
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.sub-details h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1f2937;
}
.sub-billing {
  font-size: 0.8125rem;
  color: #6b7280;
}
.sub-value {
  text-align: right;
  display: flex;
  flex-direction: column;
}
.sub-value .amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
.last-billed {
  font-size: 0.75rem;
  color: #9ca3af;
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
.total-impact {
  text-align: center;
  margin-bottom: 1rem;
}
.total-impact .value {
  margin: 0;
  color: #111827;
  font-size: 2rem;
}
.total-impact .label {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}
.impact-bar-container {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.impact-bar {
  height: 100%;
  background: #3b82f6;
}
.impact-text {
  font-size: 0.875rem;
  color: #4b5563;
  text-align: center;
}
.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.upcoming-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
}
.upcoming-item .day {
  width: 28px;
  height: 28px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.upcoming-item .name {
  flex: 1;
  color: #374151;
}
.upcoming-item .amount {
  font-weight: 600;
  color: #111827;
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
  .subscriptions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
