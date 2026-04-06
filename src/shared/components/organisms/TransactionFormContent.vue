<template>
  <form
    @submit.prevent="handleSubmit"
    class="p-5 space-y-4 bg-surface-main dark:bg-surface-main h-full max-h-none pb-4"
  >
    <!-- Type Switcher (PrimeVue SelectButton) -->
    <div class="flex flex-col gap-2">
      <SelectButton
        v-model="form.type"
        :options="typeOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        :pt="{
          root: { class: 'flex p-1.5 bg-white/5 rounded-2xl gap-1.5 border border-white/5 shadow-inner' },
          button: ({ context }: { context: any }) => ({
            class: [
              'flex-1 py-2.5 px-4 rounded-xl font-black text-[0.7rem] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden border-none shadow-none focus:ring-0',
              context.active
                ? (form.type === 'expense'
                    ? 'bg-error-main text-white shadow-[0_10px_25_rgba(248,81,73,0.3)]'
                    : 'bg-success-main text-white shadow-[0_10px_25_rgba(50,205,50,0.3)]')
                : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 bg-transparent'
            ]
          })
        }"
      >
        <template #option="slotProps">
          <div class="flex items-center gap-2">
            <i :class="slotProps.option.icon" class="text-sm"></i>
            <span>{{ slotProps.option.label }}</span>
          </div>
        </template>
      </SelectButton>
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

      <BaseInput
        id="amount"
        label="Valor (R$)"
        type="number"
        step="0.01"
        v-model="form.amount"
        placeholder="0,00"
      />

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

      <BaseInput id="date" label="Data do Lançamento" type="date" v-model="form.date" />
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
        class="flex-[2] !py-3 font-black uppercase text-[0.7rem] tracking-[0.15em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        :variant="form.type === 'expense' ? 'danger' : 'primary'"
      >
        Salvar Lançamento
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { AutoCategorizationService } from '@/modules/transactions/application/services/AutoCategorizationService'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import BaseInput from '@/shared/components/atoms/BaseInput.vue'
import BaseSelect from '@/shared/components/atoms/BaseSelect.vue'
import BaseButton from '@/shared/components/atoms/BaseButton.vue'
import SelectButton from 'primevue/selectbutton'

const props = defineProps<{
  initialData?: Transaction | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useTransactionStore()
const autoCatService = new AutoCategorizationService()

const isSubmitting = ref(false)

const typeOptions = [
  { label: 'Despesa', value: 'expense', icon: 'pi pi-arrow-down' },
  { label: 'Receita', value: 'income', icon: 'pi pi-arrow-up' }
]

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
        synced: false,
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
