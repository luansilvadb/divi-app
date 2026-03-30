<template>
  <div class="view-wrapper animate-fade-in relative min-h-screen">
    <!-- Visual background shell -->
    <BaseBackgroundOrbs />

    <!-- Feature header -->
    <BaseViewHeader 
      title="Meus Orçamentos" 
      highlight="Orçamentos"
      subtitle="Acompanhe seus limites de gastos inteligentes com a Regra 50/30/20."
    >
      <template #action>
        <BaseButton 
          variant="primary" 
          @click="showAddBudgetModal = true"
        >
          Novo Orçamento
        </BaseButton>
      </template>
    </BaseViewHeader>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <!-- Empty State -->
        <div v-if="budgets.length === 0" class="empty-state glass-card p-12 text-center flex flex-col items-center justify-center">
          <div class="empty-content max-w-md">
            <BaseIconBox color="var(--color-primary-main)" size="lg" class="mb-8 opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </BaseIconBox>
            <h3 class="text-2xl font-black text-text-primary tracking-tight mb-3">Nenhum orçamento ativo</h3>
            <p class="text-text-secondary text-sm leading-relaxed mb-8">Crie limites para controlar melhor seus gastos essenciais, conforto e investimentos.</p>
            <BaseButton variant="primary" @click="showAddBudgetModal = true">
              Começar a organizar
            </BaseButton>
          </div>
        </div>
        
        <!-- Budget List Grid -->
        <div v-else class="budgets-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
          <BudgetCard 
            v-for="budget in budgets" 
            :key="budget.id" 
            :budget="budget" 
            :consumed="getConsumed(budget)"
          />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <!-- Monthly Summary Overview -->
        <BaseCard>
          <template #header>Visão Geral do Mês</template>
          <div class="summary-details flex flex-col gap-8 pt-2">
            <BaseSummaryItem 
              label="Total Orçado"
              :value="formatCurrency(totalBudgeted)"
              color="var(--color-info-main)"
              status="info"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </template>
            </BaseSummaryItem>
            
            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <BaseSummaryItem 
              label="Gasto Acumulado"
              :value="formatCurrency(totalConsumed)"
              :color="totalConsumed > totalBudgeted ? 'var(--color-error-main)' : 'var(--color-primary-main)'"
              :status="totalConsumed > totalBudgeted ? 'error' : 'normal'"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </template>
            </BaseSummaryItem>
          </div>
        </BaseCard>

        <!-- Method Rule Panel -->
        <BaseCard>
          <template #header>Metodologia 50/30/20</template>
          <div class="rule-explanation flex flex-col gap-6 pt-2">
            <p class="rule-intro text-sm text-text-secondary font-medium leading-relaxed">
              A maneira mais simples de organizar suas finanças mantendo equilíbrio entre presente e futuro.
            </p>
            
            <ul class="rule-timeline relative flex flex-col gap-6 pl-6 list-none p-0 m-0">
              <!-- Vertical Line -->
              <div class="absolute top-2 bottom-2 left-1.5 w-0.5 bg-black/5 dark:bg-white/5 rounded-full"></div>

              <li class="timeline-item flex gap-4 relative">
                <div class="timeline-marker w-3 h-3 rounded-full bg-white border-2 border-primary-main shadow-sm z-10 mt-1"></div>
                <div class="timeline-content">
                  <h4 class="text-sm font-black text-primary-main uppercase tracking-widest mb-1">50% Essenciais</h4>
                  <p class="text-xs text-text-disabled font-medium leading-relaxed">Moradia, contas básicas, mercado, saúde e transporte.</p>
                </div>
              </li>
              <li class="timeline-item flex gap-4 relative">
                <div class="timeline-marker w-3 h-3 rounded-full bg-white border-2 border-warning-main shadow-sm z-10 mt-1"></div>
                <div class="timeline-content">
                  <h4 class="text-sm font-black text-warning-main uppercase tracking-widest mb-1">30% Estilo de Vida</h4>
                  <p class="text-xs text-text-disabled font-medium leading-relaxed">Lazer, hobbies, restaurantes, streaming e viagens.</p>
                </div>
              </li>
              <li class="timeline-item flex gap-4 relative">
                <div class="timeline-marker w-3 h-3 rounded-full bg-white border-2 border-success-main shadow-sm z-10 mt-1"></div>
                <div class="timeline-content">
                  <h4 class="text-sm font-black text-success-main uppercase tracking-widest mb-1">20% Futuro</h4>
                  <p class="text-xs text-text-disabled font-medium leading-relaxed">Reserva, quitação de dívidas e investimentos.</p>
                </div>
              </li>
            </ul>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Modals -->
    <!-- Future: BudgetForm Component -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import BaseViewHeader from '@/shared/components/organisms/BaseViewHeader.vue'
import BaseBackgroundOrbs from '@/shared/components/atoms/BaseBackgroundOrbs.vue'
import BudgetCard from '../components/BudgetCard.vue'
import type { Budget } from '@/modules/finance/domain/entities'

const showAddBudgetModal = ref(false)

// Mocks - To be integrated with financeStore and BudgetService
const budgets = ref<Budget[]>([
  {
    id: '1',
    user_id: 'user1',
    name: 'Essenciais (50%)',
    type: 'spending',
    limit_value: 3750.00,
    period_start: '2026-03-01',
    period_end: '2026-03-31',
    color: 'var(--color-info-main)',
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
    color: 'var(--color-warning-main)',
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
    color: 'var(--color-success-main)',
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
</script>

<style scoped>
/* Scoped styles removed - centralized layout handles them */
</style>
