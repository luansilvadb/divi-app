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
        <!-- Empty State -->
        <div
          v-if="store.loans.length === 0 && !store.isLoading"
          class="flex flex-col items-center justify-center py-20 opacity-40 text-center glass-card"
        >
          <div
            class="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <span class="text-sm font-black uppercase tracking-widest mb-2"
            >Nenhum empréstimo registrado</span
          >
          <p class="text-xs font-bold max-w-xs mx-auto mb-6">
            Você está livre de dívidas registradas no momento. Ótimo sinal!
          </p>
          <BaseButton variant="primary" class="px-8" @click="showAddLoanModal = true">
            Registrar Empréstimo
          </BaseButton>
        </div>

        <!-- Loading State -->
        <div v-else-if="store.isLoading" class="flex justify-center py-20">
          <div
            class="w-8 h-8 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin"
          ></div>
        </div>

        <!-- Loans Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoanCard
            v-for="loan in store.loans"
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

    <!-- Future: LoanForm Modal -->
  </StandardPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLoanStore } from '../../application/stores/loanStore'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseSummaryItem from '@/shared/components/molecules/BaseSummaryItem.vue'
import StandardPageLayout from '@/shared/components/templates/StandardPageLayout.vue'
import LoanCard from '@/shared/components/molecules/LoanCard.vue'

const store = useLoanStore()
const showAddLoanModal = ref(false)

onMounted(async () => {
  await store.fetchLoans()
})

const handleDelete = async (id: string) => {
  if (confirm('Deseja realmente remover este registro? Esta ação não pode ser desfeita.')) {
    await store.deleteLoan(id)
  }
}
</script>
