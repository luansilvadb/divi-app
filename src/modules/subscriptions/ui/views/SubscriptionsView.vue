<template>
  <StandardPageLayout
    title="Minhas Assinaturas"
    highlight="Assinaturas"
    subtitle="Gerencie seus serviços recorrentes e evite gastos desnecessários."
    :loading="store.isLoading"
  >
    <template #action>
      <div class="flex items-center gap-3">
        <AppleButton
          v-if="!isMobile"
          variant="primary"
          size="medium"
          @click="showAddSubscriptionModal = true"
        >
          Nova Assinatura
        </AppleButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2">
        <NSpace vertical :size="24">
          <BaseSearchInput v-model="store.searchQuery" placeholder="Buscar por nome do serviço..." />

          <NEmpty
            v-if="store.subscriptions.length === 0 && !store.isLoading && !store.searchQuery"
            description="Registre seus serviços recorrentes para ter uma visão clara dos seus custos mensais."
            class="py-24"
          >
            <template #icon>
              <i class="i-lucide-credit-card text-5xl text-[rgba(0,122,255,0.3)] dark:text-[rgba(10,132,255,0.3)]"></i>
            </template>
          </NEmpty>

          <NEmpty
            v-else-if="filteredSubscriptions.length === 0 && !store.isLoading && store.searchQuery"
            :description="searchEmptySubtitle"
            class="py-20"
          >
            <template #icon>
              <i class="i-lucide-search-x text-5xl"></i>
            </template>
            <template #extra>
              <NButton quaternary type="primary" size="small" @click="store.searchQuery = ''">
                Limpar Busca
              </NButton>
            </template>
          </NEmpty>

          <div v-else-if="store.isLoading" class="flex justify-center py-20">
            <NSpin size="large" />
          </div>

          <!-- Subscriptions Grid -->
          <NGrid
            v-else-if="filteredSubscriptions.length > 0"
            :cols="'1 1024:2'"
            :x-gap="16"
            :y-gap="16"
            responsive="screen"
            item-responsive
          >
            <NGridItem v-for="sub in filteredSubscriptions" :key="sub.id">
              <NCard hoverable class="cursor-pointer">
                <NSpace justify="space-between" align="center">
                  <NSpace align="center" :size="12">
                    <div class="w-11 h-11 rounded-2xl bg-[rgba(0,122,255,0.08)] flex items-center justify-center text-lg">
                      💳
                    </div>
                    <NSpace vertical :size="2">
                      <NSpace align="center" :size="6">
                        <NText strong class="text-base">{{ sub.name }}</NText>
                        <ItemSyncIndicator :status="sub.sync_status" />
                      </NSpace>
                      <NTag size="tiny" :bordered="false" round>
                        {{ sub.frequency === 'monthly' ? 'Mensal' : 'Anual' }}
                      </NTag>
                    </NSpace>
                  </NSpace>
                  <NSpace vertical :size="2" align="end">
                    <NText type="primary" strong class="text-lg tabular-nums">
                      {{ formatCurrency(sub.amount) }}
                    </NText>
                    <NText depth="3" class="text-[10px] uppercase tracking-wider">dia {{ sub.billing_day }}</NText>
                  </NSpace>
                </NSpace>
              </NCard>
            </NGridItem>
          </NGrid>
        </NSpace>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <NSpace vertical :size="16">
          <NCard>
            <template #header><NText strong>Impacto Mensal</NText></template>
            <NSpace vertical :size="16">
              <NStatistic label="Custo Fixo Total">
                <NText type="primary" strong>{{ formatCurrency(store.totalMonthlyCost) }}</NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NCard embedded size="small" class="text-center">
                <NSpace justify="space-between" align="center" class="w-full mb-3">
                  <NText depth="3" class="text-xs uppercase tracking-widest">Comprometimento</NText>
                  <NText type="primary" strong class="tabular-nums">8.4%</NText>
                </NSpace>
                <NProgress type="line" :percentage="8.4" :show-indicator="false" :height="6" />
                <NText depth="3" class="text-[10px] block mt-3">Baseado na sua renda declarada</NText>
              </NCard>
            </NSpace>
          </NCard>

          <NCard>
            <template #header><NText strong>Sinais Relevantes</NText></template>
            <NCard embedded size="small" class="!border-amber-500/10 !bg-amber-500/5">
              <NSpace align="start" :size="12">
                <NTag type="warning" size="small" round :bordered="false">
                  <template #icon><i class="i-lucide-zap text-xs"></i></template>
                </NTag>
                <NText class="text-xs leading-relaxed">
                  Identificamos <NText type="warning" strong>2 serviços</NText> com baixo uso este mês.
                  Considere cancelar para economizar.
                </NText>
              </NSpace>
            </NCard>
          </NCard>
        </NSpace>
      </aside>
    </div>

    <!-- Mobile FAB Button -->
    <div
      v-if="isMobile"
      class="fixed bottom-24 right-6 z-50 md:hidden"
    >
      <AppleButton
        variant="primary"
        size="large"
        @click="showAddSubscriptionModal = true"
        class="!rounded-full !w-14 !h-14 !p-0 !shadow-lg"
      >
        <i class="i-lucide-plus text-xl"></i>
      </AppleButton>
    </div>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  NCard,
  NStatistic,
  NSpace,
  NText,
  NTag,
  NEmpty,
  NDivider,
  NSpin,
  NProgress,
  NGrid,
  NGridItem,
} from 'naive-ui'
import { useSubscriptionStore } from '../../application/stores/subscriptionStore'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AppleButton from '@/shared/components/apple-ui/AppleButton.vue'
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
