<template>
  <StandardPageLayout
    title="Empréstimos e Dívidas"
    highlight="Empréstimos"
    subtitle="Gerencie seus compromissos financeiros e planeje a quitação total."
  >
    <template #action>
      <BaseButton variant="primary" @click="showAddLoanModal = true"> Novo Registro </BaseButton>
    </template>

    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <!-- Search Bar -->
        <div v-if="store.loans.length > 0 || store.searchQuery" class="mb-4">
          <BaseSearchInput
            v-model="store.searchQuery"
            placeholder="Buscar por nome do empréstimo..."
            :debounce="300"
            :loading="store.isLoading"
          />
        </div>

        <!-- Empty State (No loans at all) -->
        <BaseCard
          v-if="store.loans.length === 0 && !store.isLoading && !store.searchQuery"
          is-empty
          empty-title="Nenhum empréstimo registrado"
          empty-subtitle="Você está livre de dívidas registradas no momento. Ótimo sinal!"
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </template>
          <template #empty-action>
            <BaseButton variant="primary" class="px-8 mt-4" @click="showAddLoanModal = true">
              Registrar Empréstimo
            </BaseButton>
          </template>
        </BaseCard>

        <!-- Search Empty State -->
        <BaseCard
          v-else-if="filteredLoans.length === 0 && !store.isLoading && store.searchQuery"
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

        <!-- Loading State -->
        <div v-else-if="store.isLoading" class="flex justify-center py-20">
          <div
            class="w-8 h-8 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin"
          ></div>
        </div>

        <!-- Loans Grid -->
        <div
          v-else-if="filteredLoans.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <LoanCard
            v-for="loan in filteredLoans"
            :key="loan.id"
            :loan="loan"
            @delete="handleDelete"
          />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
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

            <div class="h-px bg-black/5 dark:bg-white/5"></div>

            <!-- Amortization Chart / Info placeholder -->
            <div
              class="w-full p-5 rounded-3xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center border border-black/5 dark:border-white/5"
            >
              <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-2"
                >Próximo Vencimento</span
              >
              <div class="text-xl font-black tracking-tight text-text-primary">15 de Abril</div>
              <span class="text-[0.7rem] font-bold text-text-disabled mt-1"
                >R$ 1.250,40 agendado</span
              >
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
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseSearchInput from '@/shared/components/molecules/BaseSearchInput.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import LoanCard from '@/shared/components/molecules/LoanCard.vue'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'

const store = useLoanStore()
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
