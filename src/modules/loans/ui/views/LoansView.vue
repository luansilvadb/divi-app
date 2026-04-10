<template>
  <StandardPageLayout
    title="Empréstimos e Dívidas"
    highlight="Empréstimos"
    subtitle="Gerencie seus compromissos financeiros e planeje a quitação total."
    :loading="store.isLoading"
  >
    <!-- Header Actions -->
    <template #action>
      <div class="flex items-center justify-end gap-3 w-full lg:min-w-[420px]">
        <BaseButton
          v-if="!isMobile"
          variant="primary"
          class="!rounded-xl px-6 h-10"
          @click="showAddLoanModal = true"
        >
          Novo Registro
        </BaseButton>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN COLUMN -->
      <main class="lg:col-span-2 space-y-8">
        <!-- Search Bar -->
        <BaseSearchInput
          v-model="store.searchQuery"
          placeholder="Buscar por nome do empréstimo..."
        />

        <!-- Empty State (Matches TransactionsView Style) -->
        <div
          v-if="store.loans.length === 0 && !store.isLoading && !store.searchQuery"
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h3 class="text-xl font-black uppercase tracking-[0.2em] mb-4 text-surface-800 dark:text-surface-50">
            Nenhum empréstimo
          </h3>
          <p class="text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
            Você está livre de dívidas registradas no momento. Ótimo sinal!
          </p>
        </div>

        <!-- Search Empty State -->
        <div
          v-else-if="filteredLoans.length === 0 && !store.isLoading && store.searchQuery"
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
        <!-- Summary Stats -->
        <BaseCard>
          <template #header>Panorama de Dívida</template>
          <div class="flex flex-col gap-6 pt-2">
            <BaseSummaryItem
              label="Dívida Total"
              :value="formatCurrency(store.totalDebt)"
              color="var(--color-error-main)"
              status="error"
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </template>
            </BaseSummaryItem>

            <div class="h-px bg-surface-50 dark:bg-surface-800/10"></div>

            <!-- Next Due Highlight Box -->
            <div
              class="w-full p-6 rounded-3xl bg-surface-100 dark:bg-surface-950 flex flex-col items-center text-center shadow-inner border border-surface-200 dark:border-surface-200/10"
            >
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 dark:text-surface-400 mb-3"
                >Próximo Vencimento</span
              >
              <div class="text-2xl font-black tracking-tighter text-surface-800 dark:text-surface-50">15 de Abril</div>
              <span class="text-[0.7rem] font-bold text-surface-400 dark:text-surface-400 uppercase tracking-widest mt-2"
                >R$ 1.250,40 agendado</span
              >
            </div>
          </div>
        </BaseCard>

        <!-- Insights Placeholder -->
        <BaseCard>
          <template #header>Sinais Relevantes</template>
          <div class="p-2 space-y-4">
            <div class="flex gap-4 p-4 rounded-2xl bg-error/5 border border-error-main/10">
              <div
                class="w-10 h-10 rounded-xl bg-error/10 text-error flex-shrink-0 flex items-center justify-center shadow-sm"
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
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
                </svg>
              </div>
              <p class="text-xs font-bold text-surface-600 dark:text-surface-200 leading-relaxed pt-1">
                Atenção: seus juros médios subiram <span class="text-error font-black">2.1%</span>
                neste trimestre. Avalie portabilidades.
              </p>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Delete Confirmation Overlay -->
    <Teleport to="body">
      <BaseConfirmDialog
        :show="showConfirmDelete"
        title="Excluir Empréstimo"
        message="Deseja realmente remover este registro? Esta ação não pode ser desfeita."
        confirm-text="Excluir"
        cancel-text="Cancelar"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
    </Teleport>
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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


