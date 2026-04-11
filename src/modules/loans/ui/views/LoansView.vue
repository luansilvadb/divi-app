<template>
  <StandardPageLayout
    title="Empréstimos e Dívidas"
    highlight="Empréstimos"
    subtitle="Gerencie seus compromissos financeiros e planeje a quitação total."
    :loading="store.isLoading"
  >
    <template #action>
      <div class="flex items-center justify-end gap-3 w-full lg:min-w-[420px]">
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          class="!rounded-xl px-6 h-10 shadow-lg shadow-violet-500/20"
          @click="showAddLoanModal = true"
        >
          <template #icon><i class="i-lucide-plus text-lg"></i></template>
          Novo Registro
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 space-y-8">
        <BaseSearchInput
          v-model="store.searchQuery"
          placeholder="Buscar por nome do empréstimo..."
        />

        <!-- Empty State -->
        <div
          v-if="store.loans.length === 0 && !store.isLoading && !store.searchQuery"
          class="flex flex-col items-center justify-center py-24 text-center opacity-40 animate-fade-in"
        >
          <div class="w-24 h-24 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-8 text-violet-500">
            <i class="i-lucide-landmark text-5xl"></i>
          </div>
          <h3 class="text-xl font-black uppercase tracking-widest mb-4 text-zinc-800 dark:text-zinc-50">
            Nenhum empréstimo
          </h3>
          <p class="text-xs font-bold uppercase tracking-widest text-zinc-400 leading-relaxed max-w-xs">
            Você está livre de dívidas registradas no momento. Ótimo sinal!
          </p>
        </div>

        <!-- Search Empty State -->
        <div
          v-else-if="filteredLoans.length === 0 && !store.isLoading && store.searchQuery"
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

        <!-- Loans Grid -->
        <div v-else-if="filteredLoans.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <LoanCard
            v-for="loan in filteredLoans"
            :key="loan.id"
            :loan="loan"
            @delete="handleDelete"
          />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column space-y-8">
        <BaseCard class="hover-glow">
          <template #header>Panorama de Dívida</template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Dívida Total"
              :value="formatCurrency(store.totalDebt)"
              color="#ef4444"
              status="error"
            >
              <template #icon><i class="i-lucide-alert-circle"></i></template>
            </BaseSummaryItem>

            <div class="h-px bg-zinc-100 dark:bg-zinc-800/50"></div>

            <div class="w-full p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center text-center shadow-inner border border-zinc-200 dark:border-zinc-800">
              <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Próximo Vencimento</span>
              <div class="text-2xl font-black tracking-tighter text-zinc-800 dark:text-zinc-50">
                15 de Abril
              </div>
              <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                R$ 1.250,40 agendado
              </span>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="hover-glow">
          <template #header>Sinais Relevantes</template>
          <div class="p-2 space-y-4">
            <div class="flex gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <div class="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex-shrink-0 flex items-center justify-center shadow-sm">
                <i class="i-lucide-trending-up text-xl"></i>
              </div>
              <p class="text-xs font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                Atenção: seus juros médios subiram <span class="text-red-500 font-black">2.1%</span>. Avalie portabilidades.
              </p>
            </div>
          </div>
        </BaseCard>
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
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NButton } from 'naive-ui'
import { useLoanStore } from '../../application/stores/loanStore'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
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
