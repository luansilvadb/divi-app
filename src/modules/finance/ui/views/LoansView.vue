<template>
  <div class="view-wrapper animate-fade-in relative min-h-screen">
    <!-- Visual background shell -->
    <BaseBackgroundOrbs />

    <!-- Feature header -->
    <BaseViewHeader 
      title="Controle de Dívidas" 
      highlight="Dívidas" 
      subtitle="Acompanhe seus empréstimos, parcelamentos e planeje a quitação."
    >
      <template #action>
        <BaseButton variant="primary" @click="showAddLoanModal = true">
          Novo Registro
        </BaseButton>
      </template>
    </BaseViewHeader>

    <!-- Content Grid (Holy Grail) -->
    <div class="view-content-grid">
      <!-- MAIN COLUMN -->
      <main class="main-column">
        <BaseCard
          v-if="loans.length === 0"
          is-empty
          empty-title="Nenhum empréstimo ativo"
          empty-subtitle="Registre financiamentos ou dívidas para ter controle total sobre seu saldo devedor e juros pagos com elegância."
          empty-color="var(--color-primary-main)"
        >
          <template #empty-icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </template>
          <template #empty-action>
            <BaseButton variant="primary" class="px-8" @click="showAddLoanModal = true">Registrar Primeiro Empréstimo</BaseButton>
          </template>
        </BaseCard>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoanCard
            v-for="loan in loans"
            :key="loan.id"
            :loan="loan"
            @delete="deleteLoan(loan.id)"
          />
        </div>
      </main>

      <!-- SIDEBAR COLUMN -->
      <aside class="side-column">
        <BaseCard>
          <template #header>Resumo de Dívidas</template>
          
          <div class="flex flex-col gap-8 pt-2">
            <!-- Debt Highlight Panel -->
            <div class="w-full p-6 rounded-3xl bg-bg-main dark:bg-black/20 flex flex-col items-center text-center shadow-inner border border-black/5 dark:border-white/5">
              <span class="text-[10px] font-black uppercase tracking-widest text-text-disabled mb-2">Total Devedor</span>
              <div class="text-4xl font-black text-primary-main tracking-tighter leading-none">
                {{ formatCurrency(totalDebt) }}
              </div>
            </div>

            <!-- Progress & Advice -->
            <div class="flex flex-col gap-6">
              <BaseProgressBar :percentage="100" color="var(--color-primary-main)" />
              <div class="bg-primary-main/5 p-4 rounded-2xl border border-primary-main/10 flex gap-4 items-start">
                <div class="mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary-main"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <p class="text-[0.8rem] text-text-secondary leading-relaxed">
                  Priorize quitar as dívidas que possuem <strong class="text-text-primary">maiores taxas de juros</strong> mensais.
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>

    <!-- Modals -->
    <!-- Future: LoanForm Component -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '../../application/stores/financeStore'
import { storeToRefs } from 'pinia'
import { formatCurrency } from '@/shared/utils/formatters'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseIconBox from '@/shared/components/atoms/BaseIconBox.vue'
import BaseProgressBar from '@/shared/components/atoms/BaseProgressBar.vue'
import BaseViewHeader from '@/shared/components/organisms/BaseViewHeader.vue'
import BaseBackgroundOrbs from '@/shared/components/atoms/BaseBackgroundOrbs.vue'
import LoanCard from '../components/LoanCard.vue'

const financeStore = useFinanceStore()
const { loans, totalDebt } = storeToRefs(financeStore)

const showAddLoanModal = ref(false)

onMounted(async () => {
  await financeStore.fetchLoans()
})

const deleteLoan = async (id: string) => {
  if (confirm('Tem certeza que deseja remover este empréstimo?')) {
    await financeStore.deleteLoan(id)
  }
}
</script>

<style scoped>
/* Scoped styles removed */
</style>
