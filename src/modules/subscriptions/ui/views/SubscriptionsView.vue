<template>
  <StandardPageLayout
    title="Minhas Assinaturas"
    highlight="Assinaturas"
    subtitle="Gerencie seus serviços recorrentes e evite gastos desnecessários."
  >
    <template #action>
      <BaseButton variant="primary" @click="showAddSubscriptionModal = true">
        Novo Serviço
      </BaseButton>
    </template>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <!-- Search Bar -->
        <div v-if="store.subscriptions.length > 0 || store.searchQuery" class="mb-4">
          <BaseSearchInput
            v-model="store.searchQuery"
            placeholder="Buscar por nome do serviço..."
            :debounce="300"
            :loading="store.isLoading"
          />
        </div>

        <!-- Empty State (No subscriptions at all) -->
        <BaseCard
          v-if="store.subscriptions.length === 0 && !store.isLoading && !store.searchQuery"
          is-empty
          empty-title="Sem assinaturas ativas"
          empty-subtitle="Registre seus serviços de streaming, software ou clubes para ter uma visão clara dos seus custos fixos mensais."
          empty-color="var(--color-primary-main)"
        >
          <template #empty-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
              <path d="M3 10h18" />
              <path d="M7 15h.01" />
              <path d="M11 15h.01" />
            </svg>
          </template>
          <template #empty-action>
            <BaseButton variant="primary" class="px-8" @click="showAddSubscriptionModal = true"
              >Adicionar Assinatura</BaseButton
            >
          </template>
        </BaseCard>

        <!-- Search Empty State -->
        <BaseCard
          v-else-if="filteredSubscriptions.length === 0 && !store.isLoading && store.searchQuery"
          is-empty
          empty-title="Nenhum resultado"
          :empty-subtitle="searchEmptySubtitle"
          empty-color="var(--color-primary-main)"
        >
          <template #empty-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </template>
          <template #empty-action>
            <BaseButton variant="secondary" class="px-8 mt-4" @click="store.searchQuery = ''">
              Limpar Busca
            </BaseButton>
          </template>
        </BaseCard>

        <div v-else-if="store.isLoading" class="flex justify-center py-20">
          <div
            class="w-8 h-8 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin"
          ></div>
        </div>

        <div v-else-if="filteredSubscriptions.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseCard v-for="sub in filteredSubscriptions" :key="sub.id" clickable>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <BaseIconBox color="var(--color-primary-main)" size="md">
                  <span class="text-xl">💳</span>
                </BaseIconBox>
                <div class="flex flex-col">
                  <span class="font-black text-text-primary tracking-tight">{{ sub.name }}</span>
                  <span
                    class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
                    >{{ sub.frequency === 'monthly' ? 'Mensal' : 'Anual' }}</span
                  >
                </div>
              </div>
              <div class="text-right">
                <div class="font-black text-lg text-text-primary tracking-tighter">
                  {{ formatCurrency(sub.amount) }}
                </div>
                <div class="text-[10px] font-black uppercase tracking-widest text-text-disabled">
                  Dia de cobrança: {{ sub.billing_day }}
                </div>
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
              :value="formatCurrency(store.totalMonthlyCost)"
              color="var(--color-primary-main)"
              status="info"
            >
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </template>
            </BaseSummaryItem>

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-end">
                <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled"
                  >Comprometimento da Renda</span
                >
                <span class="text-xl font-black text-primary-main tracking-tighter">8%</span>
              </div>
              <BaseProgressBar :percentage="8" color="var(--color-primary-main)" />
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSubscriptionStore } from '../../application/stores/subscriptionStore'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'

const store = useSubscriptionStore()
const showAddSubscriptionModal = ref(false)

const filteredSubscriptions = computed(() => {
  if (!store.searchQuery) return store.subscriptions
  const query = store.searchQuery.toLowerCase()
  return store.subscriptions.filter((s) => s.name.toLowerCase().includes(query))
})

const searchEmptySubtitle = computed(() => {
  return `Não encontramos assinaturas para "${store.searchQuery}"`
})

onMounted(async () => {
  await store.fetchSubscriptions()
})
</script>
