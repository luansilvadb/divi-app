<template>
  <form
    @submit.prevent="handleSubmit"
    class="p-5 space-y-4 bg-surface-main dark:bg-surface-main h-full max-h-none pb-4"
  >
    <!-- Type Switcher -->
    <div class="flex p-1.5 bg-black/5 dark:bg-black/40 rounded-xl gap-1.5 border border-black/5 dark:border-white/5 shadow-inner w-full mb-2">
      <button 
        type="button" 
        class="flex-1 py-2.5 px-4 rounded-lg font-black text-[0.7rem] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer"
        :class="form.type === 'expense' ? 'bg-[#161D2C] text-white shadow-md ring-1 ring-white/10' : 'text-text-secondary opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'"
        @click="form.type = 'expense'"
      >
        <i class="pi pi-arrow-down text-sm transition-colors duration-300" :class="form.type === 'expense' ? 'text-error-main' : ''"></i> Despesa
      </button>
      <button 
        type="button" 
        class="flex-1 py-2.5 px-4 rounded-lg font-black text-[0.7rem] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer"
        :class="form.type === 'income' ? 'bg-[#161D2C] text-white shadow-md ring-1 ring-white/10' : 'text-text-secondary opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'"
        @click="form.type = 'income'"
      >
        <i class="pi pi-arrow-up text-sm transition-colors duration-300" :class="form.type === 'income' ? 'text-success-main' : ''"></i> Receita
      </button>
    </div>

    <div class="space-y-4">
      <BaseInput
        id="title"
        label="Título da Transação"
        v-model="form.title"
        placeholder="Ex: Netflix, Supermercado..."
        class="premium-input-group"
        @input="handleTitleInput"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput
          id="amount"
          label="Valor (R$)"
          type="number"
          :step="0.01"
          v-model="form.amount"
          placeholder="0,00"
          class="!mb-0"
        />

        <div class="w-full relative">
          <label for="date" class="block text-sm font-medium mb-1 text-text-primary">Data do Lançamento</label>
          <div class="relative w-full">
            <DatePicker
              id="date"
              v-model="parsedDate"
              dateFormat="dd/mm/yy"
              showIcon
              iconDisplay="input"
              fluid
              class="premium-date"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-4 pt-4 shrink-0">
      <BaseButton
        variant="ghost"
        type="button"
        class="flex-1 !py-3 font-black uppercase text-[0.7rem] tracking-widest opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        @click="$emit('close')"
      >
        Cancelar
      </BaseButton>
      <BaseButton
        type="submit"
        :loading="isSubmitting"
        class="flex-[2] !py-3 font-black uppercase text-[0.7rem] tracking-[0.15em] transition-all"
        variant="primary"
      >
        Salvar Lançamento
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { AutoCategorizationService } from '@/modules/transactions/application/services/AutoCategorizationService'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import BaseInput from '@/shared/components/atoms/BaseInput.vue'
import BaseSelect from '@/shared/components/atoms/BaseSelect.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import DatePicker from 'primevue/datepicker'

const props = defineProps<{
  initialData?: Transaction | null
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

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.title = newData.title
      form.amount = newData.amount
      form.type = newData.type
      form.category_id = newData.category_id
      form.wallet_id = newData.wallet_id
      form.date = new Date(newData.date).toISOString().slice(0, 10)
    } else {
      form.title = ''
      form.amount = 0
      form.type = 'expense'
      form.category_id = ''
      form.wallet_id = ''
      form.date = new Date().toISOString().slice(0, 10)
    }
  },
  { immediate: true },
)

const parsedDate = computed({
  get: () => {
    if (!form.date) return new Date()
    const parts = form.date.split('-')
    const year = Number(parts[0])
    const month = Number(parts[1]) || 1
    const day = Number(parts[2]) || 1
    return new Date(year, month - 1, day)
  },
  set: (val: Date | Date[] | (Date | null)[] | null | undefined) => {
    if (val && !Array.isArray(val)) {
      const year = val.getFullYear()
      const month = String(val.getMonth() + 1).padStart(2, '0')
      const day = String(val.getDate()).padStart(2, '0')
      form.date = `${year}-${month}-${day}`
    }
  }
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
  
  if (!form.title.trim()) {
    // Basic validation alert (could be improved with a proper toast)
    alert('O título da transação é obrigatório.')
    return
  }
  
  isSubmitting.value = true
  try {
    const isEditing = !!props.initialData?.id

    if (isEditing) {
      const transactionData = {
        ...props.initialData,
        ...form,
        updated_at: new Date().toISOString(),
      }
      await store.saveTransaction(transactionData as Transaction)
    } else {
      const transactionData = {
        ...form,
        id: crypto.randomUUID(),
        user_id: '', // Will be filled by repo/service
        syncStatus: 'pending',
        deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      await store.saveTransaction(transactionData as Transaction)
    }

    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Save error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
:deep(.premium-date .p-inputtext) {
  width: 100%;
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  padding-right: 2.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  color: var(--p-surface-0);
}
@media (prefers-color-scheme: light) {
  :deep(.premium-date .p-inputtext) {
    background-color: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
    color: var(--p-surface-900);
  }
  :deep(.premium-date .p-datepicker-input-icon) {
    color: rgba(0, 0, 0, 0.4);
  }
}
:deep(.premium-date .p-inputtext:hover) {
  border-color: rgba(74, 111, 165, 0.3);
}
:deep(.premium-date .p-inputtext:focus) {
  border-color: #4a6fa5;
  box-shadow: 0 0 0 4px rgba(74, 111, 165, 0.1);
  background-color: rgba(0, 0, 0, 0.6);
  outline: none;
}
:deep(.premium-date .p-datepicker-input-icon) {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}
</style>

