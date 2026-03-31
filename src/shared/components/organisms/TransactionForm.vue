<template>
  <BaseModal :show="show" @update:show="$emit('close')">
    <BaseCard
      class="w-full shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/5 !bg-surface-main overflow-hidden flex flex-col relative"
      padding="none"
    >
      <!-- Header Area (Premium Split) -->
      <div class="bg-primary-main/10 p-7 border-b border-white/5 relative">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary-main/10 via-transparent to-transparent pointer-events-none"
        ></div>
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-2xl bg-primary-main/20 flex items-center justify-center text-primary-main shadow-inner border border-primary-main/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-black text-text-primary tracking-tight leading-tight">
                Nova Transação
              </h2>
              <p
                class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40"
              >
                Adicione um novo lançamento manual
              </p>
            </div>
          </div>
          <button
            aria-label="Fechar"
            @click="$emit('close')"
            class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all border border-white/5 group"
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
              class="group-hover:rotate-90 transition-transform duration-300"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body Area -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8 bg-black/10">
        <!-- Type Switcher (Premium) -->
        <div class="flex p-1.5 bg-white/5 rounded-2xl gap-1.5 border border-white/5 shadow-inner">
          <button
            type="button"
            class="flex-1 py-3.5 px-4 rounded-xl font-black text-[0.7rem] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            :class="
              form.type === 'expense'
                ? 'bg-error-main text-white shadow-[0_10px_25px_rgba(248,81,73,0.3)]'
                : 'text-text-secondary hover:bg-white/5'
            "
            @click="form.type = 'expense'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
            Despesa
          </button>
          <button
            type="button"
            class="flex-1 py-3.5 px-4 rounded-xl font-black text-[0.7rem] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            :class="
              form.type === 'income'
                ? 'bg-success-main text-white shadow-[0_10px_25px_rgba(50,205,50,0.3)]'
                : 'text-text-secondary hover:bg-white/5'
            "
            @click="form.type = 'income'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7 10l5 5 5-5z" class="rotate-180 origin-center" />
            </svg>
            Receita
          </button>
        </div>

        <div class="space-y-5">
          <BaseInput
            id="title"
            label="Título da Transação"
            v-model="form.title"
            placeholder="Ex: Netflix, Supermercado..."
            class="premium-input-group"
            @input="handleTitleInput"
          />

          <BaseInput
            id="amount"
            label="Valor (R$)"
            type="number"
            step="0.01"
            v-model="form.amount"
            placeholder="0,00"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <BaseSelect
              id="category"
              label="Categoria"
              v-model="form.category_id"
              :options="store.categories.map((cat) => ({ label: cat.name, value: cat.id }))"
              placeholder="Selecionar Categoria"
              class="!mb-0"
            />

            <BaseSelect
              id="wallet"
              label="Conta / Carteira"
              v-model="form.wallet_id"
              :options="store.wallets.map((w) => ({ label: w.name, value: w.id }))"
              placeholder="Selecionar Conta"
              class="!mb-0"
            />
          </div>

          <BaseInput id="date" label="Data do Lançamento" type="date" v-model="form.date" />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-4 pt-4">
          <BaseButton
            variant="ghost"
            type="button"
            class="flex-1 !py-4 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100 hover:bg-white/5 transition-all"
            @click="$emit('close')"
          >
            Cancelar
          </BaseButton>
          <BaseButton
            type="submit"
            :loading="isSubmitting"
            class="flex-[2] !py-4 font-black uppercase text-[0.7rem] tracking-[0.15em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            :variant="form.type === 'expense' ? 'danger' : 'primary'"
          >
            Salvar Lançamento
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { AutoCategorizationService } from '@/modules/transactions/application/services/AutoCategorizationService'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import BaseModal from '@/shared/components/molecules/BaseModal.vue'
import BaseCard from '@/shared/components/atoms/BaseCard.vue'
import BaseInput from '@/shared/components/atoms/BaseInput.vue'
import BaseSelect from '@/shared/components/atoms/BaseSelect.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'saved'])
const store = useTransactionStore()
const autoCatService = new AutoCategorizationService()

const isSubmitting = ref(false)

interface TransactionForm {
  title: string
  amount: number
  type: 'income' | 'expense'
  category_id: string
  wallet_id: string
  date: string
}

const form = reactive<TransactionForm>({
  title: '',
  amount: 0,
  type: 'expense' as 'income' | 'expense',
  category_id: '',
  wallet_id: '',
  date: new Date().toISOString().slice(0, 10),
})

onMounted(async () => {
  if (store.wallets.length === 0) await store.fetchWallets()
  if (store.categories.length === 0) await store.fetchCategories()
})

function handleTitleInput() {
  const suggestion = autoCatService.suggestCategory(form.title, store.categories)
  if (suggestion) {
    form.category_id = suggestion.id
  }
}

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    const transactionData = {
      ...form,
      id: crypto.randomUUID(),
      user_id: '', // Will be filled by repo/service
      synced: false,
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    await store.saveTransaction(transactionData as Transaction)
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Save error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
