<template>
  <StandardPageLayout
    title="Minhas Assinaturas"
    highlight="Assinaturas"
    subtitle="Gerencie seus serviços recorrentes e evite gastos desnecessários."
    :loading="store.isLoading"
  >
    <!-- Header Actions -->
    <template #action>
      <div class="flex items-center justify-end gap-3 w-full lg:min-w-[420px]">
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          class="!rounded-xl px-6 h-10"
          @click="showAddSubscriptionModal = true"
        >
          Novo Serviço
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 space-y-8">
        <!-- Search Bar -->
        <BaseSearchInput v-model="store.searchQuery" placeholder="Buscar por nome do serviço..." />

        <!-- Empty State (Matches TransactionsView Style) -->
        <div
          v-if="store.subscriptions.length === 0 && !store.isLoading && !store.searchQuery"
          class="flex flex-col items-center justify-center py-24 text-center opacity-40 animate-in fade-in zoom-in-95 duration-700"
        >
          <div
            class="w-24 h-24 bg-surface-50 dark:bg-surface-800/10 rounded-full flex items-center justify-center mb-8 text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
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
          </div>
          <h3
            class="text-xl font-black uppercase tracking-[0.2em] mb-4 text-surface-800 dark:text-surface-50"
          >
            Sem assinaturas
          </h3>
          <p class="text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
            Registre seus serviços recorrentes para ter uma visão clara dos seus custos mensais.
          </p>
        </div>

        <!-- Search Empty State -->
        <div
          v-else-if="filteredSubscriptions.length === 0 && !store.isLoading && store.searchQuery"
          class="flex flex-col items-center justify-center py-20 text-center opacity-40"
        >
          <div
            class="w-20 h-20 bg-surface-50 dark:bg-surface-800/10 rounded-full flex items-center justify-center mb-6"
          >
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 class="text-lg font-black uppercase tracking-widest mb-2">Nenhum resultado</h3>
          <p class="text-xs font-bold uppercase tracking-widest">{{ searchEmptySubtitle }}</p>
          <BaseButton
            variant="secondary"
            class="!rounded-xl px-8 mt-8 h-10"
            @click="store.searchQuery = ''"
          >
            Limpar Busca
          </BaseButton>
        </div>

        <!-- Loading State -->
        <div v-else-if="store.isLoading" class="flex flex-col gap-6">
          <div class="flex justify-center py-20">
            <div
              class="w-8 h-8 border-4 border-primary/20 border-t-primary-main rounded-full animate-spin"
            ></div>
          </div>
        </div>

        <!-- Subscriptions Grid -->
        <div
          v-else-if="filteredSubscriptions.length > 0"
          class="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          <BaseCard
            v-for="sub in filteredSubscriptions"
            :key="sub.id"
            clickable
            class="!rounded-3xl hover:!bg-surface-0/40 dark:bg-surface-800/40 group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform"
                >
                  💳
                </div>
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span
                      class="font-black text-surface-800 dark:text-surface-50 text-[1.05rem] tracking-tight"
                      >{{ sub.name }}</span
                    >
                    <ItemSyncIndicator :status="sub.sync_status" />
                  </div>
                  <span
                    class="text-[9px] font-black uppercase tracking-[0.15em] text-surface-400 dark:text-surface-400"
                    >{{ sub.frequency === 'monthly' ? 'Mensal' : 'Anual' }}</span
                  >
                </div>
              </div>
              <div class="text-right">
                <div class="font-black text-xl text-primary tracking-tighter">
                  {{ formatCurrency(sub.amount) }}
                </div>
                <div
                  class="text-[9px] font-black uppercase tracking-[0.1em] text-surface-400 dark:text-surface-400"
                >
                  Vencimento: dia {{ sub.billing_day }}
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column space-y-8">
        <!-- Monthly Impact Stats -->
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

            <div class="h-px bg-surface-50 dark:bg-surface-800/10"></div>

            <!-- Income Commitment Highlight Box -->
            <div
              class="w-full p-6 rounded-3xl bg-surface-100 dark:bg-surface-950 flex flex-col items-center text-center shadow-inner border border-surface-200 dark:border-surface-200/10"
            >
              <div class="flex justify-between items-center w-full mb-3 px-1">
                <span
                  class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 dark:text-surface-400"
                  >Comprometimento</span
                >
                <span class="text-sm font-black text-primary tracking-tighter">8.4%</span>
              </div>
              <BaseProgressBar :percentage="8.4" color="var(--color-primary-main)" />
              <p
                class="text-[9px] font-bold text-surface-400 dark:text-surface-400 uppercase mt-5 tracking-widest"
              >
                Baseado na sua renda declarada
              </p>
            </div>
          </div>
        </BaseCard>

        <!-- Insights -->
        <BaseCard>
          <template #header>Sinais Relevantes</template>
          <div class="p-2 space-y-4">
            <div class="flex gap-4 p-4 rounded-2xl bg-accent-main/5 border border-accent-main/10">
              <div
                class="w-10 h-10 rounded-xl bg-accent-main/10 text-accent flex-shrink-0 flex items-center justify-center shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  />
                </svg>
              </div>
              <p
                class="text-xs font-bold text-surface-600 dark:text-surface-200 leading-relaxed pt-1"
              >
                Identificamos <span class="text-accent font-black">2 serviços</span> com baixo uso
                este mês. Considere cancelar para economizar
                <span class="text-surface-800 dark:text-surface-50">R$ 54,00</span>.
              </p>
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
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import ItemSyncIndicator from '@/shared/components/atoms/ItemSyncIndicator.vue'

const store = useSubscriptionStore()
const isMobile = useIsMobile()
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
