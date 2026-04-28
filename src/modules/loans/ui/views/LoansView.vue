<template>
  <StandardPageLayout
    title="Empréstimos e Dívidas"
    highlight="Empréstimos"
    subtitle="Gerencie seus compromissos financeiros e planeje a quitação total."
    :loading="store.isLoading"
  >
    <template #action>
      <div class="flex items-center gap-3">
        <AppleButton
          v-if="!isMobile"
          variant="primary"
          size="medium"
          @click="showAddLoanModal = true"
        >
          Novo Empréstimo
        </AppleButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2">
        <NSpace vertical :size="24">
          <BaseSearchInput
            v-model="store.searchQuery"
            placeholder="Buscar por nome do empréstimo..."
          />

          <NEmpty
            v-if="store.loans.length === 0 && !store.isLoading && !store.searchQuery"
            description="Você está livre de dívidas registradas no momento. Ótimo sinal!"
            class="py-24"
          >
            <template #icon>
              <i class="i-lucide-landmark text-5xl text-[rgba(0,122,255,0.3)] dark:text-[rgba(10,132,255,0.3)]"></i>
            </template>
          </NEmpty>

          <NEmpty
            v-else-if="filteredLoans.length === 0 && !store.isLoading && store.searchQuery"
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

          <NGrid
            v-else-if="filteredLoans.length > 0"
            :cols="'1 1024:2'"
            :x-gap="20"
            :y-gap="20"
            responsive="screen"
            item-responsive
          >
            <NGridItem v-for="loan in filteredLoans" :key="loan.id">
              <LoanCard :loan="loan" @delete="handleDelete" />
            </NGridItem>
          </NGrid>
        </NSpace>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <NSpace vertical :size="16">
          <NCard>
            <template #header><NText strong>Panorama de Dívida</NText></template>
            <NSpace vertical :size="16">
              <NStatistic label="Dívida Total">
                <NText type="error" strong>{{ formatCurrency(store.totalDebt) }}</NText>
              </NStatistic>

              <NDivider class="!my-0" />

              <NCard embedded size="small" class="text-center">
                <NText depth="3" class="text-xs uppercase tracking-widest block mb-2">Próximo Vencimento</NText>
                <NText strong class="text-xl block">15 de Abril</NText>
                <NText depth="3" class="text-xs">R$ 1.250,40 agendado</NText>
              </NCard>
            </NSpace>
          </NCard>

          <NCard>
            <template #header><NText strong>Sinais Relevantes</NText></template>
            <NCard embedded size="small" class="!border-red-500/10 !bg-red-500/5">
              <NSpace align="start" :size="12">
                <NTag type="error" size="small" round :bordered="false">
                  <template #icon><i class="i-lucide-trending-up text-xs"></i></template>
                </NTag>
                <NText class="text-xs leading-relaxed">
                  Atenção: seus juros médios subiram <NText type="error" strong>2.1%</NText>. Avalie portabilidades.
                </NText>
              </NSpace>
            </NCard>
          </NCard>
        </NSpace>
      </aside>
    </div>

    <BaseConfirmDialog
      :show="showConfirmDelete"
      title="Excluir Empréstimo"
      message="Deseja realmente remover este registro? Esta ação não pode ser desfeita."
      confirm-text="Excluir"
      cancel-text="Cancelar"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Mobile FAB Button -->
    <div
      v-if="isMobile"
      class="fixed bottom-24 right-6 z-50 md:hidden"
    >
      <AppleButton
        variant="primary"
        size="large"
        @click="showAddLoanModal = true"
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
  NGrid,
  NGridItem,
} from 'naive-ui'
import { useLoanStore } from '../../application/stores/loanStore'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import AppleButton from '@/shared/components/apple-ui/AppleButton.vue'
import LoanCard from '@/shared/components/molecules/LoanCard.vue'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'

const store = useLoanStore()
const isMobile = useIsMobile()
const showAddLoanModal = ref(false)
const showConfirmDelete = ref(false)
const loanToDelete = ref<string | null>(null)

const filteredLoans = computed(() => {
  if (!store.searchQuery) return store.loans
  const query = store.searchQuery.toLowerCase()
  return store.loans.filter((l) => l.name.toLowerCase().includes(query))
})

const searchEmptySubtitle = computed(() => {
  return `Não encontramos empréstimos para "${store.searchQuery}"`
})

onMounted(async () => {
  await store.fetchLoans()
})

const handleDelete = (id: string) => {
  loanToDelete.value = id
  showConfirmDelete.value = true
}

const confirmDelete = async () => {
  if (loanToDelete.value) {
    await store.deleteLoan(loanToDelete.value)
    showConfirmDelete.value = false
    loanToDelete.value = null
  }
}

const cancelDelete = () => {
  showConfirmDelete.value = false
  loanToDelete.value = null
}
</script>
