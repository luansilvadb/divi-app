<template>
  <div class="view-wrapper animate-fade-in relative min-h-screen">
    <!-- Visual background shell -->
    <BaseBackgroundOrbs />

    <!-- Feature header -->
    <BaseViewHeader 
      title="Minhas Assinaturas" 
      highlight="Assinaturas" 
      subtitle="Gerencie seus serviços recorrentes e evite gastos desnecessários."
    >
      <template #action>
        <BaseButton variant="primary" @click="showAddSubscriptionModal = true">
          Novo Serviço
        </BaseButton>
      </template>
    </BaseViewHeader>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <BaseCard
          v-if="subscriptions.length === 0"
          is-empty
          empty-title="Sem assinaturas ativas"
          empty-subtitle="Registre seus serviços de streaming, software ou clubes para ter uma visão clara dos seus custos fixos mensais."
          empty-color="var(--color-primary-main)"
        >
          <template #empty-icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M3 10h18"/><path d="M7 15h.01"/><path d="M11 15h.01"/></svg>
          </template>
          <template #empty-action>
            <BaseButton variant="primary" class="px-8" @click="showAddSubscriptionModal = true">Adicionar Assinatura</BaseButton>
          </template>
        </BaseCard>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseCard v-for="sub in subscriptions" :key="sub.id" clickable>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <BaseIconBox color="var(--color-primary-main)" size="md">
                  <span class="text-xl">💳</span>
                </BaseIconBox>
                <div class="flex flex-col">
                  <span class="font-black text-text-primary tracking-tight">{{ sub.name }}</span>
                  <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled">{{ sub.frequency === 'monthly' ? 'Mensal' : 'Anual' }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="font-black text-lg text-text-primary tracking-tighter">{{ formatCurrency(sub.amount) }}</div>
                <div class="text-[10px] font-black uppercase tracking-widest text-text-disabled">Dia de cobrança: {{ sub.billing_day }}</div>
              </div>
            </div>
          </BaseCard>
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <BaseCard>
          <template #header>Impacto Mensal</template>
          <div class="flex flex-col gap-8 pt-2">
            <BaseSummaryItem 
              label="Custo Fixo Total" 
              :value="formatCurrency(totalMonthlyCost)" 
              color="var(--color-primary-main)"
              status="info"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </template>
            </BaseSummaryItem>

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-end">
                <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled">Comprometimento da Renda</span>
                <span class="text-xl font-black text-primary-main tracking-tighter">8%</span>
              </div>
              <BaseProgressBar :percentage="8" color="var(--color-primary-main)" />
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import BaseViewHeader from '@/shared/components/organisms/BaseViewHeader.vue'
import BaseBackgroundOrbs from '@/shared/components/atoms/BaseBackgroundOrbs.vue'

const financeStore = useFinanceStore()
const showAddSubscriptionModal = ref(false)

const subscriptions = computed(() => financeStore.subscriptions)
const totalMonthlyCost = computed(() => subscriptions.value.reduce((sum, s) => sum + s.amount, 0))

onMounted(async () => {
  await financeStore.fetchSubscriptions()
})
</script>
