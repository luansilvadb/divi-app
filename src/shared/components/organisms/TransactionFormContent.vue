<template>
  <div class="p-6 bg-white dark:bg-[#1c1c1e] h-full">
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
      class="space-y-5"
    >
      <!-- Luxury Type Switcher (Segmented Control) -->
      <NFormItem :show-label="false" path="type">
        <NRadioGroup
          v-model:value="form.type"
          name="transaction-type"
          class="w-full"
        >
          <div class="flex p-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-[9px] w-full relative overflow-hidden">

            <!-- Expense Tab -->
            <NRadioButton
              value="expense"
              class="flex-1 !rounded-[7px] !border-none !bg-transparent text-center select-none transition-all duration-150 ease-out relative"
            >
              <div class="flex items-center justify-center gap-2 py-2.5">
                <span
                  class="font-semibold text-[13px] tracking-tight transition-all duration-150"
                  :class="form.type === 'expense' ? 'text-[#1d1d1f] dark:text-white' : 'text-[#6e6e73] dark:text-[#8e8e93]'"
                >
                  Despesa
                </span>
              </div>
            </NRadioButton>

            <!-- Income Tab -->
            <NRadioButton
              value="income"
              class="flex-1 !rounded-[7px] !border-none !bg-transparent text-center select-none transition-all duration-150 ease-out relative"
            >
              <div class="flex items-center justify-center gap-2 py-2.5">
                <span
                  class="font-semibold text-[13px] tracking-tight transition-all duration-150"
                  :class="form.type === 'income' ? 'text-[#1d1d1f] dark:text-white' : 'text-[#6e6e73] dark:text-[#8e8e93]'"
                >
                  Receita
                </span>
              </div>
            </NRadioButton>
          </div>
        </NRadioGroup>
      </NFormItem>

      <!-- Title Input -->
      <NFormItem label="Título" path="title">
        <template #label>
          <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Título</span>
        </template>
        <NInput
          v-model:value="form.title"
          placeholder="Ex: Netflix, Supermercado..."
          @input="handleTitleInput"
          class="!rounded-xl"
        />
      </NFormItem>

      <NGrid :x-gap="20" :cols="2">
        <!-- Amount Input (BRL Formatted) -->
        <NGi>
          <NFormItem label="Valor" path="amount">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Valor</span>
            </template>
            <NInput
              :value="displayAmount"
              placeholder="0,00"
              class="w-full !rounded-xl"
              @input="handleInputAmount"
            >
              <template #prefix>
                <span class="text-[13px] font-semibold text-[#8e8e93] dark:text-[#636366] mr-1">{{ activeConfig?.symbol || 'R$' }}</span>
              </template>
            </NInput>
          </NFormItem>
        </NGi>

        <!-- Date Picker -->
        <NGi>
          <NFormItem label="Data" path="date">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Data</span>
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

      <NGrid :x-gap="20" :cols="2">
        <!-- Category Selection -->
        <NGi>
          <NFormItem label="Categoria" path="category_id">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Categoria</span>
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
          <NFormItem label="Conta" path="wallet_id">
            <template #label>
              <span class="text-[13px] font-semibold text-[#6e6e73] dark:text-[#8e8e93] tracking-[-0.02em]">Conta</span>
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

      <!-- Action Buttons (Apple Style) -->
      <div class="flex items-center gap-3 pt-8">
        <NButton
          v-if="props.initialData"
          type="error"
          secondary
          class="flex-1 !h-[48px] !rounded-xl font-semibold text-[17px] tracking-tight !bg-[#ff3b30]/10 !text-[#ff3b30] hover:!bg-[#ff3b30] hover:!text-white active:scale-[0.98] select-none transition-all duration-150"
          @click="handleDelete"
        >
          Excluir
        </NButton>
        <NButton
          type="primary"
          :loading="isSubmitting"
          class="flex-[2] !h-[48px] !rounded-xl font-semibold text-[17px] tracking-tight !bg-[#0071e3] hover:!bg-[#0066cc] active:scale-[0.98] select-none transition-all duration-150"
          @click="handleSubmit"
        >
          Salvar
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
  NSelect,
  NRadioGroup,
  NRadioButton,
  NGrid,
  NGi,
  useMessage,
  type FormInst
} from 'naive-ui'
import { useTransactionStore } from '@/modules/transactions/application/stores/transactionStore'
import { AutoCategorizationService } from '@/modules/transactions/application/services/AutoCategorizationService'
import { AutoCreateService } from '@/modules/transactions/application/services/AutoCreateService'
import type { Transaction } from '@/shared/domain/entities/Transaction'
import BaseConfirmDialog from '@/shared/components/molecules/BaseConfirmDialog.vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import { useTransactionValidation } from '@/modules/transactions/application/composables/useTransactionValidation'

const props = defineProps<{
  initialData?: Transaction | null
}>()

const emit = defineEmits(['close', 'saved'])
const store = useTransactionStore()
const autoCatService = new AutoCategorizationService()
const autoCreateService = container.resolve<AutoCreateService>(DI_TOKENS.AutoCreateService)
const { rules, validateForm } = useTransactionValidation()
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
  } catch {
    message.error('Erro ao excluir transação.')
  } finally {
    isSubmitting.value = false
  }
}

// Colors moved to AutoCreateService

interface TransactionForm {
  title: string
  amount: number | null
  type: 'income' | 'expense' | 'transfer'
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

// Rules are now from useTransactionValidation composable

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
  return currencyConfigs[currency] || currencyConfigs['BRL']
})

// --- Live Masking Logic ---

const displayAmount = computed(() => {
  if (form.amount === null) return ''
  return new Intl.NumberFormat(activeConfig.value?.locale || 'pt-BR', {
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
      // Convert bigint to number for the UI form
      form.amount = typeof newData.amount === 'bigint' ? Number(newData.amount) / 100 : newData.amount
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

async function buildTransactionData(): Promise<Transaction> {
  const finalCategoryId = await autoCreateService.resolveCategory(form.category_id, store.categories)
  const finalWalletId = await autoCreateService.resolveWallet(form.wallet_id, store.wallets)

  return {
    ...props.initialData,
    ...form,
    category_id: finalCategoryId,
    wallet_id: finalWalletId,
    amount: BigInt(Math.round((form.amount || 0) * 100)),
    id: props.initialData?.id || uuidv7(),
    user_id: props.initialData?.user_id || '',
    sync_status: 'pending' as const,
    deleted: props.initialData?.deleted || false,
    client_updated_at: new Date().toISOString(),
    version: (props.initialData?.version || 0) + 1,
  } as Transaction
}

async function handleSubmit() {
  const { valid: isValid } = validateForm(form)
  if (!isValid) {
    formRef.value?.validate((errors) => { if (errors) return })
    return
  }

  isSubmitting.value = true
  try {
    const transactionData = await buildTransactionData()
    await store.saveTransaction(transactionData)
    emit('saved')
    emit('close')
    message.success('Transação salva com sucesso!')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao salvar transação.'
    message.error(msg)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Naive UI theme handles all styling via naiveTheme.ts */

/* Segmented Control - Apple Style */
:deep(.n-radio-button) {
  --n-button-border-radius: 7px !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

:deep(.n-radio-button:active) {
  transform: scale(0.97);
  opacity: 0.85;
}

/* Selected button - permanent pressed state */
:deep(.n-radio-button.n-radio-button--checked) {
  background-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
  transform: scale(1);
}

:is(.dark) :deep(.n-radio-button.n-radio-button--checked) {
  background-color: #3a3a3c !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

:deep(.n-radio-button .n-radio-button__state-border) {
  display: none !important;
}

:deep(.n-radio-button:focus-within) {
  outline: none !important;
}

:deep(.n-radio-button:focus-visible) {
  box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.4) !important;
  border-radius: 7px !important;
}

/* Button interactions */
:deep(.n-button) {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

:deep(.n-button:active) {
  transform: scale(0.98);
}

:deep(.n-button.n-button--loading) {
  opacity: 0.85 !important;
}
</style>

