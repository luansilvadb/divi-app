<template>
  <StandardPageLayout
    title="Minhas Assinaturas"
    highlight="Assinaturas"
    subtitle="Gerencie seus serviços recorrentes e evite gastos desnecessários."
    :loading="store.isLoading"
  >
    <template #action>
      <div class="flex items-center justify-end gap-3 w-full lg:min-w-[420px]">
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          class="!rounded-xl px-6 h-10 shadow-lg shadow-violet-500/20"
          @click="showAddSubscriptionModal = true"
        >
          <template #icon><i class="i-lucide-plus text-lg"></i></template>
          Novo Serviço
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 space-y-8">
        <BaseSearchInput v-model="store.searchQuery" placeholder="Buscar por nome do serviço..." />

        <!-- Empty State -->
        <div
          v-if="store.subscriptions.length === 0 && !store.isLoading && !store.searchQuery"
          class="flex flex-col items-center justify-center py-24 text-center opacity-40 animate-fade-in"
        >
          <div class="w-24 h-24 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-8 text-violet-500">
            <i class="i-lucide-credit-card text-5xl"></i>
          </div>
          <h3 class="text-xl font-black uppercase tracking-widest mb-4 text-zinc-800 dark:text-zinc-50">
            Sem assinaturas
          </h3>
          <p class="text-xs font-bold uppercase tracking-widest text-zinc-400 leading-relaxed max-w-xs">
            Registre seus serviços recorrentes para ter uma visão clara dos seus custos mensais.
          </p>
        </div>

        <!-- Search Empty State -->
        <div
          v-else-if="filteredSubscriptions.length === 0 && !store.isLoading && store.searchQuery"
          class="flex flex-col items-center justify-center py-20 text-center opacity-40 animate-fade-in"
        >
          <div class="w-20 h-20 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
            <i class="i-lucide-search-x text-4xl text-zinc-400"></i>
          </div>
          <h3 class="text-lg font-black uppercase tracking-widest mb-2 text-zinc-800 dark:text-zinc-50">Nenhum resultado</h3>
          <p class="text-xs font-bold uppercase tracking-widest text-zinc-400">{{ searchEmptySubtitle }}</p>
          <NButton quaternary circle class="mt-8 text-violet-500 font-bold" @click="store.searchQuery = ''">
            Limpar Busca
          </NButton>
        </div>

        <!-- Loading State -->
        <div v-else-if="store.isLoading" class="flex justify-center py-20">
          <i class="i-lucide-loader-2 animate-spin text-4xl text-violet-500"></i>
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
            class="hover-glow group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform"
                >
                  💳
                </div>
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span
                      class="font-black text-zinc-800 dark:text-zinc-50 text-[1.05rem] tracking-tight"
                      >{{ sub.name }}</span
                    >
                    <ItemSyncIndicator :status="sub.sync_status" />
                  </div>
                  <span
                    class="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400"
                    >{{ sub.frequency === 'monthly' ? 'Mensal' : 'Anual' }}</span
                  >
                </div>
              </div>
              <div class="text-right">
                <div class="font-black text-xl text-violet-500 tracking-tighter">
                  {{ formatCurrency(sub.amount) }}
                </div>
                <div
                  class="text-[9px] font-black uppercase tracking-[0.1em] text-zinc-400"
                >
                  dia {{ sub.billing_day }}
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column space-y-8">
        <BaseCard class="hover-glow">
          <template #header>Impacto Mensal</template>
          <div class="flex flex-col gap-8 pt-2">
            <BaseSummaryItem
              label="Custo Fixo Total"
              :value="formatCurrency(store.totalMonthlyCost)"
              color="#8b5cf6"
              status="info"
            >
              <template #icon><i class="i-lucide-credit-card"></i></template>
            </BaseSummaryItem>

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <div
              class="w-full p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center text-center shadow-inner border border-zinc-200 dark:border-zinc-800"
            >
              <div class="flex justify-between items-center w-full mb-3 px-1">
                <span
                  class="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                  >Comprometimento</span
                >
                <span class="text-sm font-black text-violet-500 tracking-tighter">8.4%</span>
              </div>
              <BaseProgressBar :percentage="8.4" color="#8b5cf6" />
              <p
                class="text-[9px] font-bold text-zinc-400 uppercase mt-5 tracking-widest"
              >
                Baseado na sua renda declarada
              </p>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="hover-glow">
          <template #header>Sinais Relevantes</template>
          <div class="p-2 space-y-4">
            <div class="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <div
                class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex-shrink-0 flex items-center justify-center shadow-sm"
              >
                <i class="i-lucide-zap text-xl"></i>
              </div>
              <p
                class="text-xs font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1"
              >
                Identificamos <span class="text-amber-500 font-black">2 serviços</span> com baixo uso
                este mês. Considere cancelar para economizar.
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
import { NButton } from 'naive-ui'
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
