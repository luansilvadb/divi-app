<template>
  <div class="p-6 bg-transparent h-full">
    <!-- Confirm Delete Dialog -->
    <BaseConfirmDialog
      :show="showConfirmDelete"
      title="Excluir Transação"
      message="Tem certeza que deseja excluir esta transação? Esta ação não poderá ser desfeita."
      confirm-text="Excluir"
      cancel-text="Cancelar"
      @confirm="confirmDelete"
      @cancel="showConfirmDelete = false"
    />

    <NForm
      ref="formRef"
      :model="form"
      :rules="rules"
      size="large"
      label-placement="top"
      class="space-y-4"
    >
      <!-- Luxury Type Switcher (Segmented Control) -->
      <NFormItem :show-label="false" path="type">
        <NRadioGroup
          v-model:value="form.type"
          name="transaction-type"
          class="w-full"
        >
          <div class="flex p-1.5 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-2xl gap-1.5 border border-zinc-200 dark:border-zinc-800 shadow-inner w-full relative">
            
            <!-- Expense Tab -->
            <NRadioButton
              value="expense"
              class="flex-1 !rounded-xl !border-none !bg-transparent text-center transition-all duration-300"
              :class="{ 
                '!bg-white dark:!bg-zinc-800 !shadow-[0_4px_12px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20': form.type === 'expense' 
              }"
            >
              <div class="flex items-center justify-center gap-2.5 py-2">
                <div 
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="form.type === 'expense' ? 'bg-red-500 scale-125 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-zinc-300 dark:bg-zinc-600'"
                ></div>
                <span 
                  class="font-black text-[11px] uppercase tracking-[0.2em] transition-colors"
                  :class="form.type === 'expense' ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400'"
                >
                  Despesa
                </span>
              </div>
            </NRadioButton>

            <!-- Income Tab -->
            <NRadioButton
              value="income"
              class="flex-1 !rounded-xl !border-none !bg-transparent text-center transition-all duration-300"
              :class="{ 
                '!bg-white dark:!bg-zinc-800 !shadow-[0_4px_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20': form.type === 'income' 
              }"
            >
              <div class="flex items-center justify-center gap-2.5 py-2">
                <div 
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="form.type === 'income' ? 'bg-emerald-500 scale-125 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-300 dark:bg-zinc-600'"
                ></div>
                <span 
                  class="font-black text-[11px] uppercase tracking-[0.2em] transition-colors"
                  :class="form.type === 'income' ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400'"
                >
                  Receita
                </span>
              </div>
            </NRadioButton>
          </div>
        </NRadioGroup>
      </NFormItem>

      <!-- Title Input -->
      <NFormItem label="Título da Transação" path="title">
        <template #label>
          <div class="flex items-center gap-2 opacity-60">
            <i class="i-lucide-tag text-xs"></i>
            <span class="text-[10px] uppercase font-bold tracking-widest">Título</span>
          </div>
        </template>
        <NInput
          v-model:value="form.title"
          placeholder="Ex: Netflix, Supermercado..."
          class="!rounded-xl"
          @input="handleTitleInput"
        />
      </NFormItem>

      <NGrid :x-gap="16" :cols="2">
        <!-- Amount Input (BRL Formatted) -->
        <NGi>
          <NFormItem label="Valor" path="amount">
            <template #label>
              <div class="flex items-center gap-2 opacity-60">
                <i class="i-lucide-banknote text-xs"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">Valor</span>
              </div>
            </template>
            <NInput
              :value="displayAmount"
              placeholder="0,00"
              class="w-full !rounded-xl"
              @input="handleInputAmount"
            >
              <template #prefix>
                <span class="text-xs font-bold opacity-40 mr-1">{{ activeConfig.symbol }}</span>
              </template>
            </NInput>
          </NFormItem>
        </NGi>

        <!-- Date Picker -->
        <NGi>
          <NFormItem label="Data" path="date">
            <template #label>
              <div class="flex items-center gap-2 opacity-60">
                <i class="i-lucide-calendar text-xs"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">Data</span>
              </div>
            </template>
            <NDatePicker
              v-model:value="timestampDate"
              type="date"
              format="dd/MM/yyyy"
              class="w-full !rounded-xl"
              input-readonly
            />
          </NFormItem>
        </NGi>
      </NGrid>

      <NGrid :x-gap="16" :cols="2">
        <!-- Category Selection -->
        <NGi>
          <NFormItem label="Categoria" path="category_id">
            <template #label>
              <div class="flex items-center gap-2 opacity-60">
                <i class="i-lucide-layers text-xs"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">Categoria</span>
              </div>
            </template>
            <NSelect
              v-model:value="form.category_id"
              :options="categoryOptions"
              filterable
              tag
              scrollable
              placeholder="Selecione ou crie..."
              class="!rounded-xl"
            />
          </NFormItem>
        </NGi>

        <!-- Wallet Selection -->
        <NGi>
          <NFormItem label="Carteira" path="wallet_id">
            <template #label>
              <div class="flex items-center gap-2 opacity-60">
                <i class="i-lucide-wallet text-xs"></i>
                <span class="text-[10px] uppercase font-bold tracking-widest">Conta</span>
              </div>
            </template>
            <NSelect
              v-model:value="form.wallet_id"
              :options="walletOptions"
              filterable
              tag
              scrollable
              placeholder="Selecione ou crie..."
              class="!rounded-xl"
            />
          </NFormItem>
        </NGi>
      </NGrid>

      <!-- Action Buttons (Clean Layout) -->
      <div class="flex items-center gap-4 pt-6">
        <NButton
          v-if="props.initialData"
          type="error"
          secondary
          class="flex-1 !h-12 !rounded-xl font-bold uppercase text-[10px] tracking-widest !bg-red-500/10 !text-red-600 hover:!bg-red-600 hover:!text-white transition-all duration-300"
          @click="handleDelete"
        >
          Excluir Registro
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
    </NForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { v7 as uuidv7 } from 'uuid'
import { 
  NDatePicker, 
  NButton, 
  NForm, 
  NFormItem, 
  NInput, 
  NInputNumber, 
  NSelect, 
  NRadioGroup, 
  NRadioButton,
  NGrid,
  NGi,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { AutoCategorizationService } from '@/modules/transactions/application/services/AutoCategorizationService'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import type { Category } from '@/shared/domain/entities/Category'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'

const props = defineProps<{
  initialData?: Transaction | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useTransactionStore()
const autoCatService = new AutoCategorizationService()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const showConfirmDelete = ref(false)

// --- Actions ---

const handleDelete = () => {
  showConfirmDelete.value = true
}

const confirmDelete = async () => {
  if (!props.initialData?.id) return
  showConfirmDelete.value = false
  isSubmitting.value = true
  try {
    await store.deleteTransaction(props.initialData.id)
    message.success('Transação excluída com sucesso.')
    emit('saved')
    emit('close')
  } catch (error: any) {
    message.error('Erro ao excluir transação.')
  } finally {
    isSubmitting.value = false
  }
}

const colors = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
]

interface TransactionForm {
  title: string
  amount: number | null
  type: 'income' | 'expense'
  category_id: string | null
  wallet_id: string | null
  date: string
}

const form = reactive<TransactionForm>({
  title: '',
  amount: null,
  type: 'expense',
  category_id: null,
  wallet_id: null,
  date: new Date().toISOString().slice(0, 10),
})

const rules: FormRules = {
  title: { required: true, message: 'Título é obrigatório', trigger: 'blur' },
  amount: { required: true, type: 'number', min: 0.01, message: 'Valor deve ser maior que zero', trigger: 'blur' },
  category_id: { required: true, message: 'Selecione uma categoria', trigger: 'change' },
  wallet_id: { required: true, message: 'Selecione uma conta', trigger: 'change' }
}

const categoryOptions = computed(() => 
  store.categories.map(cat => ({ label: cat.name, value: cat.id }))
)

const walletOptions = computed(() => 
  store.wallets.map(w => ({ label: w.name, value: w.id }))
)

const currencyConfigs: Record<string, { locale: string; symbol: string }> = {
  BRL: { locale: 'pt-BR', symbol: 'R$' },
  USD: { locale: 'en-US', symbol: '$' },
  EUR: { locale: 'de-DE', symbol: '€' },
}

const activeWallet = computed(() => {
  return store.wallets.find(w => w.id === form.wallet_id)
})

const activeConfig = computed(() => {
  const currency = activeWallet.value?.currency || 'BRL'
  return currencyConfigs[currency] || currencyConfigs.BRL
})

// --- Live Masking Logic ---

const displayAmount = computed(() => {
  if (form.amount === null) return ''
  return new Intl.NumberFormat(activeConfig.value.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(form.amount)
})

function handleInputAmount(val: string) {
  const digits = val.replace(/\D/g, '')
  if (!digits) {
    form.amount = null
    return
  }
  form.amount = Number(digits) / 100
}

const formatCurrency = (value: number | null) => {
  if (value === null || isNaN(value)) return ''
  return new Intl.NumberFormat(activeConfig.value.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const timestampDate = computed({
  get: () => new Date(form.date + 'T12:00:00').getTime(),
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
  formRef.value?.validate(async (errors) => {
    if (errors) return

    isSubmitting.value = true
    try {
      let finalCategoryId = form.category_id

      if (finalCategoryId && !store.categories.some(c => c.id === finalCategoryId)) {
        const existingByName = store.categories.find(
          (c) => c.name.toLowerCase() === finalCategoryId?.toLowerCase(),
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

      let finalWalletId = form.wallet_id
      if (finalWalletId && !store.wallets.some((w) => w.id === finalWalletId)) {
        const existingByName = store.wallets.find(
          (w) => w.name.toLowerCase() === finalWalletId?.toLowerCase(),
        )
        if (existingByName) {
          finalWalletId = existingByName.id
        } else {
          await store.saveWallet({
            name: finalWalletId,
            balance: 0,
            currency: 'BRL',
          } as Wallet)
          const newlyCreated = store.wallets.find((w) => w.name === finalWalletId)
          if (newlyCreated) finalWalletId = newlyCreated.id
        }
      }

      const transactionData = {
        ...(props.initialData || {}),
        ...form,
        category_id: finalCategoryId,
        wallet_id: finalWalletId,
        amount: form.amount || 0,
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
  })
}
</script>

<style scoped>
:deep(.n-input), 
:deep(.n-input-number), 
:deep(.n-date-picker),
:deep(.n-select .n-base-selection) {
  --n-border-radius: 12px !important;
  background-color: rgba(var(--color-zinc-500-rgb), 0.05) !important;
  border: 1px solid transparent !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.n-input:hover),
:deep(.n-select .n-base-selection:hover) {
  border-color: rgba(139, 92, 246, 0.3) !important;
}

:deep(.n-input.n-input--focus),
:deep(.n-select.n-select--active .n-base-selection) {
  background-color: transparent !important;
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1) !important;
}

:is(.dark) :deep(.n-input), 
:is(.dark) :deep(.n-input-number), 
:is(.dark) :deep(.n-date-picker),
:is(.dark) :deep(.n-select .n-base-selection) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.n-form-item .n-form-item-label) {
  padding-bottom: 4px;
}

/* Luxury Radio Button Fixes */
:deep(.n-radio-button) {
  --n-button-border-radius: 14px !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.n-radio-button .n-radio-button__state-border) {
  display: none !important;
}

:deep(.n-radio-button.n-radio-button--checked) {
  background-color: transparent !important;
}

/* Custom focus ring that matches the pill shape */
:deep(.n-radio-button:focus-within) {
  outline: none !important;
}

:deep(.n-radio-button:focus-visible) {
  box-shadow: 0 0 0 2px #8b5cf6 !important;
  border-radius: 14px !important;
}
</style>

