<template>
  <form
    @submit.prevent="handleSubmit"
    class="p-6 space-y-6 bg-transparent h-full"
  >
    <!-- Type Switcher (LobeHub Style) -->
    <div
      class="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl gap-1 border border-zinc-200 dark:border-zinc-800 shadow-inner w-full"
    >
      <button
        type="button"
        class="flex-1 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
        :class="
          form.type === 'expense'
            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-transparent'
        "
        @click="form.type = 'expense'"
      >
        <i class="i-lucide-arrow-down-circle text-sm" :class="form.type === 'expense' ? 'text-red-500' : ''"></i>
        Despesa
      </button>
      <button
        type="button"
        class="flex-1 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
        :class="
          form.type === 'income'
            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-transparent'
        "
        @click="form.type = 'income'"
      >
        <i class="i-lucide-arrow-up-circle text-sm" :class="form.type === 'income' ? 'text-emerald-500' : ''"></i>
        Receita
      </button>
    </div>

    <div class="space-y-5">
      <BaseInput
        id="title"
        label="Título da Transação"
        v-model="form.title"
        placeholder="Ex: Netflix, Supermercado..."
        icon="i-lucide-tag"
        @input="handleTitleInput"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <BaseInput
          id="amount"
          label="Valor (R$)"
          type="number"
          :step="0.01"
          :min="0"
          v-model="form.amount"
          placeholder="0,00"
          icon="i-lucide-banknote"
          class="!mb-0"
        />

        <div class="w-full">
          <label class="block text-sm font-medium mb-1 text-zinc-800 dark:text-zinc-50">Data</label>
          <NDatePicker
            v-model:value="timestampDate"
            type="date"
            format="dd/MM/yyyy"
            class="!rounded-xl"
            input-readonly
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <BaseSelect
          id="category"
          label="Categoria"
          v-model="form.category_id"
          :options="store.categories.map((cat) => ({ label: cat.name, value: cat.id }))"
          placeholder="Selecione ou digite nova"
          class="!mb-0"
          editable
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
    <div class="flex items-center gap-4 pt-6 mt-4">
      <NButton
        quaternary
        circle
        class="flex-1 !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-widest text-zinc-400"
        @click="$emit('close')"
      >
        Cancelar
      </NButton>
      <NButton
        type="primary"
        :loading="isSubmitting"
        class="flex-[2] !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-violet-500/20"
        @click="handleSubmit"
      >
        Salvar Lançamento
      </NButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { v7 as uuidv7 } from 'uuid'
import { NDatePicker, NButton, useMessage } from 'naive-ui'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { AutoCategorizationService } from '@/modules/transactions/application/services/AutoCategorizationService'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'
import BaseInput from '@/shared/components/atoms/BaseInput.vue'
import BaseSelect from '@/shared/components/atoms/BaseSelect.vue'

const props = defineProps<{
  initialData?: Transaction | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useTransactionStore()
const autoCatService = new AutoCategorizationService()
const message = useMessage()

const isSubmitting = ref(false)

const colors = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
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
  type: 'expense',
  category_id: '',
  wallet_id: '',
  date: new Date().toISOString().slice(0, 10),
})

const timestampDate = computed({
  get: () => new Date(form.date).getTime(),
  set: (val: number) => {
    form.date = new Date(val).toISOString().slice(0, 10)
  }
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

  if (!form.title.trim()) {
    message.error('O título da transação é obrigatório.')
    return
  }

  if (form.amount <= 0) {
    message.error('O valor da transação deve ser maior que zero.')
    return
  }

  isSubmitting.value = true
  try {
    let finalCategoryId = form.category_id

    if (finalCategoryId && !store.categories.some(c => c.id === finalCategoryId)) {
      const existingByName = store.categories.find(
        (c) => c.name.toLowerCase() === finalCategoryId.toLowerCase(),
      )
      if (existingByName) {
        finalCategoryId = existingByName.id
      } else {
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        await store.saveCategory({
          name: finalCategoryId,
          color: randomColor,
        } as Category)
        const newlyCreated = store.categories.find((c) => c.name === finalCategoryId)
        if (newlyCreated) finalCategoryId = newlyCreated.id
      }
    }

    const transactionData = {
      ...(props.initialData || {}),
      ...form,
      category_id: finalCategoryId,
      id: props.initialData?.id || uuidv7(),
      user_id: props.initialData?.user_id || '',
      sync_status: 'pending' as const,
      deleted: props.initialData?.deleted || false,
      client_updated_at: new Date().toISOString(),
      version: (props.initialData?.version || 0) + 1,
    }

    await store.saveTransaction(transactionData as Transaction)
    emit('saved')
    emit('close')
    message.success('Transação salva com sucesso!')
  } catch (error: any) {
    message.error(error.message || 'Erro ao salvar transação.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
:deep(.n-input), :deep(.n-input-number), :deep(.n-date-picker) {
  --n-border-radius: 12px !important;
  background-color: rgba(var(--color-zinc-500-rgb), 0.05) !important;
}
:is(.dark) :deep(.n-input), :is(.dark) :deep(.n-input-number), :is(.dark) :deep(.n-date-picker) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
